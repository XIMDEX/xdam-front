import React, { useState } from 'react';

type Variant = {
  name: string;
  conditions: string[];
};

type Condition = {
  id: string;
  label: string;
};

const initialVariants: Variant[] = [
  { name: 'default', conditions: ['condition1', 'condition3'] },
  { name: 'variant1', conditions: ['condition2'] },
];

const availableConditions: Condition[] = [
  { id: 'condition1', label: 'Condición 1' },
  { id: 'condition2', label: 'Condición 2' },
  { id: 'condition3', label: 'Condición 3' },
  { id: 'condition4', label: 'Condición 4' },
];

export default function VariantSelector({conditions, variants, handleBack}: {conditions: Condition[], variants: Variant[], handleBack: () => void}) {
  const [initialVariants, setInitialVariants] = useState<Variant[]>([{ name: 'default', conditions: ['condition1', 'condition3'] },...variants]);
  const [selectedVariant, setSelectedVariant] = useState<Variant>(initialVariants[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [newVariantName, setNewVariantName] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [showConditions, setShowConditions] = useState(false);

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const variant = initialVariants.find(v => v.name === e.target.value);
    if (variant) {
      setSelectedVariant(variant);
      setIsEditing(false);
    }
  };

  const handleNewVariant = () => {
    if (isEditing) {
      setIsEditing(false);
      setNewVariantName('');
      setSelectedConditions([]);
      setInitialVariants(prev => [...prev, { name: newVariantName, conditions: selectedConditions }]);
      if (showConditions) {
        setShowConditions(false);
      }
    } else {
      setIsEditing(true);
      if (!showConditions) {
        setShowConditions(true);
      }
      setSelectedConditions([]);
    }
  };

  const handleConditionChange = (conditionId: string) => {
    setSelectedConditions(prev =>
      prev.includes(conditionId)
        ? prev.filter(id => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', width: '100%', margin: '0 auto' ,  marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #ccc' }}>
      <div style={{ display: 'flex', justifyContent: 'start', marginBottom: (showConditions ? '20px' : 0), gap: 20, width: '100%' }}>

        <button
            onClick={() => {handleBack?.()}}
            style={{
                padding: '8px 10px',
                backgroundColor: 'rgb(79, 70, 229)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: 120,
                alignSelf: 'flex-start'
            }}
        >Go to Editor</button>
        <button
            onClick={() => setShowConditions(prev => !prev)}
            style={{
              padding: '5px 10px',
              backgroundColor: 'rgb(79, 70, 229)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              width: 150,
            }}
        >{showConditions ? 'Hide Conditions' : 'Show Conditions'}</button>
        <select
          value={selectedVariant.name}
          onChange={handleVariantChange}
          style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc', width: '200px', flexGrow: 1 }}
        >
          {initialVariants.map(variant => (
            <option key={variant.name} value={variant.name}>{variant.name}</option>
          ))}
        </select>
      </div>

      {isEditing && (
        <input
          type="text"
          value={newVariantName}
          onChange={(e) => setNewVariantName(e.target.value)}
          placeholder="New variant name"
          style={{
            width: '100%',
            padding: '5px',
            marginBottom: '20px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
      )}

      {showConditions && (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'start', gap: 10}}>
            {conditions.map((condition, index) => (
                <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    type="checkbox"
                    checked={isEditing ? selectedConditions.includes(condition.id) : selectedVariant.conditions.includes(condition.id)}
                    onChange={() => handleConditionChange(condition.id)}
                    disabled={!isEditing}
                    style={{ marginRight: '10px' }}
                />
                {condition.label}
                </label>
            ))}
        </div>
      )}
    </div>
  );
}

