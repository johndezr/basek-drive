'use client';

import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/shadcn/Accordion';
import { Checkbox } from '@/components/ui/shadcn/Checkbox';
import { Folder, File as FileIcon } from 'lucide-react';
import type { File } from '@/app/domain/models/File';

type FileTreeProps = {
  files: File[];
  selectedItems: string[];
  onToggle: (item: File, isChecked: boolean) => void;
};

const FileTreeItem = ({
  item,
  selectedItems,
  onToggle,
  level = 0,
}: {
  item: File;
  selectedItems: string[];
  onToggle: (item: File, isChecked: boolean) => void;
  level?: number;
}) => {
  const isSelected = selectedItems.includes(item.id);

  const handleCheckboxChange = (checked: boolean) => {
    onToggle(item, checked);
  };

  // Para archivos individuales
  if (item.type === 'file') {
    return (
      <div className={`pl-${level * 4} flex items-center gap-2 py-2`}>
        <Checkbox checked={isSelected} onCheckedChange={handleCheckboxChange} className="mr-2" />
        <FileIcon className="mr-2 h-4 w-4" />
        <span className="text-sm">{item.name}</span>
      </div>
    );
  }

  // Para carpetas (con accordion)
  return (
    <Accordion type="single" collapsible className={`pl-${level * 4}`}>
      <AccordionItem value={item.id} className="border-b-0">
        <div className="flex items-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="mr-2"
            onClick={(e) => e.stopPropagation()} // Evitar que el click en el checkbox expanda/colapse el accordion
          />
          <AccordionTrigger className="py-2 hover:no-underline">
            <div className="flex items-center">
              <Folder className="mr-2 h-4 w-4" />
              <span className="text-sm">{item.name}</span>
            </div>
          </AccordionTrigger>
        </div>
        <AccordionContent>
          {item.children?.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              selectedItems={selectedItems}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

const FileTree: React.FC<FileTreeProps> = ({ files, selectedItems, onToggle }) => {
  return (
    <div className="file-tree max-h-[600px] overflow-auto rounded-md border p-4">
      {files.map((item) => (
        <FileTreeItem key={item.id} item={item} selectedItems={selectedItems} onToggle={onToggle} />
      ))}
    </div>
  );
};

export default FileTree;
