import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-600 mb-4">
      <Link to="/" className="hover:text-orange-500 font-medium sm:font-normal">
        Home
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <div className="hidden sm:block">
            <FiChevronRight size={16} />
          </div>
          <span className="sm:hidden text-gray-400">›</span>
          {item.link ? (
            <Link to={item.link} className="hover:text-orange-500">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;