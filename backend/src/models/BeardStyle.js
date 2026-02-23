const { query } = require('../config/database');

class BeardStyle {
  // Normalize face shape from AI to database format
  static normalizeFaceShape(faceShape) {
    if (!faceShape) return null;
    
    const normalized = faceShape.trim().toLowerCase();
    
    // Mapping from various formats to database names
    const shapeMappings = {
      // English
      'oval': 'Oval',
      'round': 'Round',
      'square': 'Square',
      'rectangle': 'Rectangle',
      'rectangular': 'Rectangle',
      'oblong': 'Rectangle', // Oblong is similar to Rectangle
      'heart': 'Heart',
      'heart-shaped': 'Heart',
      'diamond': 'Diamond',
      'triangle': 'Triangle',
      
      // Croatian
      'ovalno': 'Oval',
      'okruglo': 'Round',
      'kvadratno': 'Square',
      'pravougaono': 'Rectangle',
      'oblong': 'Rectangle',
      'srcoliko': 'Heart',
      'dijamant': 'Diamond',
      'trougaono': 'Triangle',
    };
    
    return shapeMappings[normalized] || faceShape; // Return original if no mapping
  }
  // Get all beard styles with optional filters
  static async findAll(filters = {}) {
    let sql = `
      SELECT bs.*, 
             ARRAY_AGG(DISTINCT t.name) as tags,
             ARRAY_AGG(DISTINCT ft.name) as recommended_face_type_names
      FROM beard_styles bs
      LEFT JOIN beard_style_tags bst ON bs.id = bst.beard_style_id
      LEFT JOIN tags t ON bst.tag_id = t.id
      LEFT JOIN face_types ft ON ft.id = ANY(bs.recommended_face_types)
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;

    // Filter by category
    if (filters.category) {
      sql += ` AND bs.style_category = $${paramCount}`;
      params.push(filters.category);
      paramCount++;
    }

    // Filter by maintenance level
    if (filters.maintenanceLevel) {
      sql += ` AND bs.maintenance_level = $${paramCount}`;
      params.push(filters.maintenanceLevel);
      paramCount++;
    }

    // Filter by face type
    if (filters.faceType) {
      sql += ` AND $${paramCount} = ANY(
        SELECT ft.id FROM face_types ft 
        WHERE ft.name = $${paramCount + 1} AND ft.id = ANY(bs.recommended_face_types)
      )`;
      params.push(filters.faceType, filters.faceType);
      paramCount += 2;
    }

    // Search by name or description
    if (filters.search) {
      sql += ` AND (bs.name ILIKE $${paramCount} OR bs.description ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
      paramCount++;
    }

    sql += ` GROUP BY bs.id ORDER BY bs.popularity_score DESC, bs.name ASC`;

    const result = await query(sql, params);
    return result.rows;
  }

  // Get single beard style by ID
  static async findById(id) {
    const result = await query(
      `SELECT bs.*,
              ARRAY_AGG(DISTINCT t.name) as tags,
              ARRAY_AGG(DISTINCT ft.name) as recommended_face_type_names
       FROM beard_styles bs
       LEFT JOIN beard_style_tags bst ON bs.id = bst.beard_style_id
       LEFT JOIN tags t ON bst.tag_id = t.id
       LEFT JOIN face_types ft ON ft.id = ANY(bs.recommended_face_types)
       WHERE bs.id = $1
       GROUP BY bs.id`,
      [id]
    );
    return result.rows[0];
  }

  // Get beard style by slug
  static async findBySlug(slug) {
    const result = await query(
      `SELECT bs.*,
              ARRAY_AGG(DISTINCT t.name) as tags,
              ARRAY_AGG(DISTINCT ft.name) as recommended_face_type_names
       FROM beard_styles bs
       LEFT JOIN beard_style_tags bst ON bs.id = bst.beard_style_id
       LEFT JOIN tags t ON bst.tag_id = t.id
       LEFT JOIN face_types ft ON ft.id = ANY(bs.recommended_face_types)
       WHERE bs.slug = $1
       GROUP BY bs.id`,
      [slug]
    );
    return result.rows[0];
  }

  // Get recommendations based on questionnaire
  static async getRecommendations(questionnaireData) {
    const { faceShape, lifestyle, maintenancePreference, ageRange } = questionnaireData;

    // Normalize face shape
    const normalizedFaceShape = this.normalizeFaceShape(faceShape);

    // Get face type ID
    const faceTypeResult = await query(
      'SELECT id FROM face_types WHERE name = $1',
      [normalizedFaceShape]
    );
    
    if (faceTypeResult.rows.length === 0) {
      console.warn(`No face type found for: ${faceShape} (normalized: ${normalizedFaceShape})`);
      return [];
    }

    const faceTypeId = faceTypeResult.rows[0].id;

    // Build recommendation query with scoring
    const result = await query(
      `SELECT bs.*,
              ARRAY_AGG(DISTINCT t.name) as tags,
              ARRAY_AGG(DISTINCT ft.name) as recommended_face_type_names,
              (
                CASE WHEN $1 = ANY(bs.recommended_face_types) THEN 50 ELSE 0 END +
                CASE WHEN bs.maintenance_level = $2 THEN 30 ELSE 0 END +
                CASE WHEN bs.style_category ILIKE '%' || $3 || '%' THEN 20 ELSE 0 END +
                (bs.popularity_score / 10)
              ) as recommendation_score
       FROM beard_styles bs
       LEFT JOIN beard_style_tags bst ON bs.id = bst.beard_style_id
       LEFT JOIN tags t ON bst.tag_id = t.id
       LEFT JOIN face_types ft ON ft.id = ANY(bs.recommended_face_types)
       GROUP BY bs.id
       HAVING (
         CASE WHEN $1 = ANY(bs.recommended_face_types) THEN 50 ELSE 0 END +
         CASE WHEN bs.maintenance_level = $2 THEN 30 ELSE 0 END +
         CASE WHEN bs.style_category ILIKE '%' || $3 || '%' THEN 20 ELSE 0 END +
         (bs.popularity_score / 10)
       ) > 10
       ORDER BY recommendation_score DESC
       LIMIT 10`,
      [faceTypeId, maintenancePreference, lifestyle]
    );

    return result.rows;
  }

  // Get popular styles
  static async getPopular(limit = 10) {
    const result = await query(
      `SELECT bs.*,
              ARRAY_AGG(DISTINCT t.name) as tags,
              ARRAY_AGG(DISTINCT ft.name) as recommended_face_type_names
       FROM beard_styles bs
       LEFT JOIN beard_style_tags bst ON bs.id = bst.beard_style_id
       LEFT JOIN tags t ON bst.tag_id = t.id
       LEFT JOIN face_types ft ON ft.id = ANY(bs.recommended_face_types)
       GROUP BY bs.id
       ORDER BY bs.popularity_score DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  // Increment popularity score
  static async incrementPopularity(styleId) {
    await query(
      'UPDATE beard_styles SET popularity_score = popularity_score + 1 WHERE id = $1',
      [styleId]
    );
  }

  // Get all tags
  static async getAllTags() {
    const result = await query(
      'SELECT * FROM tags ORDER BY category, name'
    );
    return result.rows;
  }

  // Get all face types
  static async getAllFaceTypes() {
    const result = await query(
      'SELECT * FROM face_types ORDER BY name'
    );
    return result.rows;
  }
}

module.exports = BeardStyle;
