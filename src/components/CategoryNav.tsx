// src/components/CategoryNav.tsx

import { useEffect, useState } from 'react';
import api from '@/src/lib/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  totalCount: number;
  isParent: boolean;
}

interface CategoryNavProps {
  category_Id: number;
  onCategorySelect: (categoryId: number, categoryName: string) => void;
}

const CategoryNav = ({ category_Id, onCategorySelect }: CategoryNavProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('wp/v2/categories');
        const fetchedCategories = response.data;

        // Calculate total post counts for parent categories
        const categoryMap: Record<number, Category> = {};
        fetchedCategories.forEach((category: Category) => {
          categoryMap[category.id] = { ...category };
        });
        Object.values(categoryMap).forEach((category) => {
          category.totalCount = category.count;
          if (category.parent !== 0) {
            let parent = categoryMap[category.parent];
            if (parent) { parent.isParent = true; }
            while (parent) {
              parent.totalCount += category.count;
              parent = parent.parent !== 0 ? categoryMap[parent.parent] : null as unknown as Category; // 添加类型断言
            }
          }
        });
        setCategories(Object.values(categoryMap));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = async (category: Category) => {
    if (category.isParent){
      if (expandedCategories.includes(category.id)) {
        setExpandedCategories(expandedCategories.filter(id => id !== category.id));
      } else {
        setExpandedCategories([...expandedCategories, category.id]);
      }
    }
    if (category.count !== 0){
      onCategorySelect(category.id, category.name);
    }
  };

  const renderCategories = (parentCategoryId: number) => {
    return categories
      .filter(category => category.parent === parentCategoryId && category.totalCount !== 0)
      .map(category => (
        <li key={category.id} className="mb-2">
          <div className="flex items-center">
            <span
              className={`transform transition-transform duration-100 ease-in ${expandedCategories.includes(category.id) ? 'rotate-0' : '-rotate-90'} mr-2`}
              onClick={() => toggleCategory(category)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className="transform transition-transform duration-100 ease-in"
                style={{ minWidth: '20px', minHeight: '20px' }}
              >
                <g fill="none" fillRule="evenodd" transform="translate(-446 -398)">
                  <path
                    fill="currentColor"
                    fillRule="nonzero"
                    d="M95.8838835,240.366117 C95.3957281,239.877961 94.6042719,239.877961 94.1161165,240.366117 C93.6279612,240.854272 93.6279612,241.645728 94.1161165,242.133883 L98.6161165,246.633883 C99.1042719,247.122039 99.8957281,247.122039 100.383883,246.633883 L104.883883,242.133883 C105.372039,241.645728 105.372039,240.854272 104.883883,240.366117 C104.395728,239.877961 103.604272,239.877961 103.116117,240.366117 L99.5,243.982233 L95.8838835,240.366117 Z"
                    transform="translate(356.5 164.5)"
                  ></path>
                  <polygon points="446 418 466 418 466 398 446 398"></polygon>
                </g>
              </svg>
            </span>
            <span
              className="text-sm cursor-pointer"
              onClick={() => toggleCategory(category)}
              style={{ marginLeft: '4px' }} // 调整标题和图标之间的间距
            >
              {category.name} { (category.totalCount !== 0) ? "(" + category.totalCount + ")" : ""}
            </span>
          </div>
          {expandedCategories.includes(category.id) && (
            <ul className="pl-6 mt-2">
              {renderCategories(category.id)}
            </ul>
          )}
        </li>
      ));
  };

  return (
    <nav className="w-1/6 p-4 bg-gray-100 text-black">
      <ul>
        {categories.length > 0 ? (
          renderCategories(0) // Start with top-level categories (parent id is 0)
        ) : (
          <li>No categories found.</li>
        )}
      </ul>
    </nav>
  );
};

export default CategoryNav;
