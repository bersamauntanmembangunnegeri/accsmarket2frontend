import React from 'react';

const PlatformBreadcrumb = ({ selectedPlatform, selectedCategory, onNavigate }) => {
  const breadcrumbItems = [
    { label: 'Home', onClick: () => onNavigate('home') }
  ];

  if (selectedPlatform) {
    breadcrumbItems.push({
      label: selectedPlatform,
      onClick: () => onNavigate('platform', selectedPlatform)
    });
  }

  if (selectedCategory) {
    breadcrumbItems.push({
      label: selectedCategory.category_name,
      onClick: () => onNavigate('category', selectedCategory)
    });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400">/</span>}
          <button
            onClick={item.onClick}
            className="hover:text-blue-600 transition-colors"
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default PlatformBreadcrumb;

