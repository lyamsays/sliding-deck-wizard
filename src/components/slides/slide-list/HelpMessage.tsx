
import React from 'react';
import { Edit, Download } from "lucide-react";

const HelpMessage: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
      <div className="flex items-center mb-2">
        <Edit className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          Click on any text to edit your slides directly. Your changes will be saved automatically.
        </p>
      </div>
      <div className="flex items-center">
        <Download className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
        <p className="text-sm text-blue-700">
          Export your presentation as PDF or PowerPoint using the export buttons below.
        </p>
      </div>
    </div>
  );
};

export default HelpMessage;
