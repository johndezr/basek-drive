import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FileTree from '../../../src/components/ui/FileTree';
import type { File } from '../../../src/domain/models/File';

const mockOnToggle = vi.fn();

const mockFiles: File[] = [
  {
    id: '1',
    name: 'Folder 1',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'File 1.1',
        type: 'file',
      },
      {
        id: '3',
        name: 'File 1.2',
        type: 'file',
      },
    ],
  },
  {
    id: '5',
    name: 'File 2',
    type: 'file',
  },
];

describe('FileTree.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('correctly renders files and folders', () => {
    const { container } = render(
      <FileTree files={mockFiles} selectedItems={[]} onToggle={mockOnToggle} />,
    );

    expect(screen.getByText('Folder 1')).toBeInTheDocument();

    const folderTrigger = screen.getByText('Folder 1');
    fireEvent.click(folderTrigger);

    expect(screen.getByText('File 1.1')).toBeVisible();
    expect(screen.getByText('File 1.2')).toBeVisible();

    expect(screen.getByText('File 2')).toBeInTheDocument();

    const folderIcon = container.getElementsByClassName('lucide lucide-folder').length;
    const fileIcon = container.getElementsByClassName('lucide lucide-file').length;
    expect(folderIcon).toBe(1);
    expect(fileIcon).toBe(3);
  });

  it('calls onToggle when clicking on a checkbox', () => {
    render(<FileTree files={mockFiles} selectedItems={[]} onToggle={mockOnToggle} />);

    const folderTrigger = screen.getByText('Folder 1');
    fireEvent.click(folderTrigger);

    // get checkbox de "File 1.1" with data-test-id
    const fileCheckbox = screen.getByTestId('2');
    fireEvent.click(fileCheckbox);

    expect(mockOnToggle).toHaveBeenCalled();
  });

  it('check the selected checkboxes', () => {
    render(<FileTree files={mockFiles} selectedItems={['2']} onToggle={mockOnToggle} />);

    const folderTrigger = screen.getByText('Folder 1');
    fireEvent.click(folderTrigger);

    const fileCheckbox = screen.getByTestId('2');

    expect(fileCheckbox).toBeChecked();
  });
});
