import React, { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ items, allowMultiple = false }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="accordion">
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        return (
          <div key={item.id} className="accordion-item border mb-2">
            <div
              className="accordion-header p-3 bg-light cursor-pointer"
              onClick={() => toggleItem(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{item.title}</h5>
                <span>{isOpen ? '−' : '+'}</span>
              </div>
            </div>
            {isOpen && (
              <div className="accordion-content p-3">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
