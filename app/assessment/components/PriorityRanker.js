'use client';

import { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Available business priorities
const BUSINESS_PRIORITIES = [
  { id: 'Cost', label: 'Cost Reduction', emoji: '💰' },
  { id: 'Quality', label: 'Quality Improvement', emoji: '✅' },
  { id: 'Safety', label: 'Safety Enhancement', emoji: '⛑️' },
  { id: 'Delivery', label: 'Delivery Performance', emoji: '🚚' },
  { id: 'Sustainability', label: 'Sustainability', emoji: '🌱' },
  { id: 'Flexibility', label: 'Process Flexibility', emoji: '🔄' }
];

function SortableItem({ id, handle, label, emoji }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="flex items-center p-3 mb-2 bg-white rounded-lg border border-gray-200 shadow-sm cursor-grab"
    >
      <div 
        className="mr-3 text-gray-400 cursor-grab"
        {...attributes}
        {...listeners}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>
      <div className="flex items-center flex-1">
        <span className="text-xl mr-2">{emoji}</span>
        <span className="font-medium">{label}</span>
      </div>
    </div>
  );
}

export default function PriorityRanker({ value = [], onChange }) {
  // If no values provided, start with default priorities
  const [items, setItems] = useState(() => {
    if (value && value.length > 0) {
      return value.map(id => BUSINESS_PRIORITIES.find(p => p.id === id))
        .filter(Boolean);
    }
    return BUSINESS_PRIORITIES;
  });

  // Call onChange with initial values only once when component mounts
  useEffect(() => {
    if (onChange && (!value || value.length === 0)) {
      onChange(items.map(item => item.id));
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Call the onChange prop with just the IDs
        if (onChange) {
          onChange(newItems.map(item => item.id));
        }
        
        return newItems;
      });
    }
  }

  return (
    <div className="my-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Rank Your Business Priorities</h3>
        <p className="text-sm text-gray-600">Drag and drop to rank from most important (top) to least important (bottom).</p>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {items.map(item => (
              <SortableItem
                key={item.id}
                id={item.id}
                label={item.label}
                emoji={item.emoji}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
} 