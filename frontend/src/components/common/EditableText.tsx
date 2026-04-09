import { useState, ReactNode } from 'react';
import { useEditMode } from '@/contexts/EditModeContext';
import { useAuthStore } from '@/stores/authStore';
import { Edit2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface EditableTextProps {
  id: string;
  children: string;
  onSave?: (newValue: string) => void;
  className?: string;
  isTextarea?: boolean;
}

export function EditableText({ id, children, onSave, className = '', isTextarea = false }: EditableTextProps) {
  const { isEditMode } = useEditMode();
  const { account } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(children);
  
  const isAdmin = account?.role === 'admin' || account?.role === 'moderator';
  const canEdit = isEditMode && isAdmin;

  const handleSave = () => {
    if (!editValue.trim()) {
      toast.error('Контент не може бути порожнім');
      return;
    }
    
    onSave?.(editValue);
    toast.success('Контент оновлено');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(children);
    setIsEditing(false);
  };

  if (isEditing && canEdit) {
    return (
      <div className="inline-flex items-center space-x-1 bg-wow-ice/10 px-2 py-1 rounded">
        {isTextarea ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="bg-gray-800 text-white px-2 py-1 rounded text-sm min-w-48 border border-wow-ice/50 focus:outline-none focus:border-wow-ice"
            rows={3}
          />
        ) : (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="bg-gray-800 text-white px-2 h-8 min-w-48 border border-wow-ice/50 focus:outline-none focus:border-wow-ice"
            autoFocus
          />
        )}
        <button
          onClick={handleSave}
          className="p-1 hover:bg-green-500/30 rounded transition-colors"
          title="Зберегти"
        >
          <Check className="w-4 h-4 text-green-400" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1 hover:bg-red-500/30 rounded transition-colors"
          title="Відмінити"
        >
          <X className="w-4 h-4 text-red-400" />
        </button>
      </div>
    );
  }

  return (
    <span
      className={`relative inline-block group ${canEdit ? 'cursor-pointer' : ''} ${className}`}
      onDoubleClick={() => canEdit && setIsEditing(true)}
    >
      {children}
      {canEdit && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-wow-ice/30 rounded"
          title="Редагувати"
        >
          <Edit2 className="w-3 h-3 text-wow-ice" />
        </button>
      )}
    </span>
  );
}
