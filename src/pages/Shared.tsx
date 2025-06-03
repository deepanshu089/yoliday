import React from 'react';
import { useOutletContext } from 'react-router-dom';

// Define the context type expected from the Outlet
interface PortfolioOutletContext {
  searchQuery: string;
}

const Shared: React.FC = () => {
   const { searchQuery } = useOutletContext<PortfolioOutletContext>();
   console.log('Shared component rendered. searchQuery:', searchQuery);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Shared Projects</h2>
      <p>This is the shared projects page. Content and search functionality are not yet implemented.</p>
      {searchQuery && (
          <p className="mt-4 text-gray-600">Search query applied: "{searchQuery}"</p>
      )}
    </div>
  );
};

export default Shared;