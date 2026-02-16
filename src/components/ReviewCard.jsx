import React from 'react';

const ReviewCard = ({ title, children, rightElement }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6 transition-all duration-300 hover:shadow-xl">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-gray-800 font-bold text-lg tracking-tight">
          {title}
        </h3>
        {rightElement && (
          <div>{rightElement}</div>
        )}
      </div>
      <div className="p-6 text-gray-600 leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default ReviewCard;