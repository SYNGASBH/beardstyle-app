import { useMemo } from 'react';
import stylesData from '../data/styles.json';
import type {
  BeardStyle,
  StylesCatalog,
  StylesMap,
  FilterState,
  BeardStyleWithImages
} from '../types/beard.types';

// Cast imported JSON to typed catalog
const catalog = stylesData as StylesCatalog;

/**
 * Hook to access beard styles catalog with filtering and lookup utilities
 */
export function useBeardStyles() {
  // All styles from catalog
  const styles: BeardStyle[] = catalog.styles;

  // Map for O(1) lookup by ID
  const stylesMap: StylesMap = useMemo(() => {
    return styles.reduce((acc, style) => {
      acc[style.id] = style;
      return acc;
    }, {} as StylesMap);
  }, [styles]);

  // Get style by ID
  const getStyle = (id: string): BeardStyle | undefined => {
    return stylesMap[id];
  };

  // Get styles by family
  const getStylesByFamily = (family: string): BeardStyle[] => {
    return styles.filter(s => s.family === family);
  };

  // Filter styles based on UI filter state
  const filterStyles = (filters: FilterState): BeardStyle[] => {
    return styles.filter(style => {
      const f = style.ui.filters;

      // Check each filter if specified
      if (filters.coverage?.length && !filters.coverage.includes(f.coverage)) {
        return false;
      }
      if (filters.cheeks?.length && !filters.cheeks.includes(f.cheeks)) {
        return false;
      }
      if (filters.neckline?.length && !filters.neckline.includes(f.neckline)) {
        return false;
      }
      if (filters.bottom_shape?.length && !filters.bottom_shape.includes(f.bottom_shape)) {
        return false;
      }
      if (filters.maintenance?.length && !filters.maintenance.includes(f.maintenance)) {
        return false;
      }

      // Text search in name, tags, and rules
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableText = [
          style.name,
          ...style.ui.tags,
          ...style.rules.must,
          ...style.rules.notes
        ].join(' ').toLowerCase();

        if (!searchableText.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  };

  // Get styles with image paths
  const getStylesWithImages = (): BeardStyleWithImages[] => {
    return styles.map(style => ({
      ...style,
      imagePath: `/assets/sketches/${style.id}.webp`,
      thumbnailPath: `/assets/thumbnails/${style.id}-thumb.webp`,
      imageExists: true // Will be validated at runtime
    }));
  };

  // Get unique families
  const families = useMemo(() => {
    return [...new Set(styles.map(s => s.family))];
  }, [styles]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    styles.forEach(s => s.ui.tags.forEach(t => tags.add(t)));
    return [...tags].sort();
  }, [styles]);

  return {
    styles,
    stylesMap,
    catalog,
    getStyle,
    getStylesByFamily,
    filterStyles,
    getStylesWithImages,
    families,
    allTags,
    version: catalog.version,
    generated: catalog.generated
  };
}

export default useBeardStyles;
