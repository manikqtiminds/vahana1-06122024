import { useState, useEffect } from 'react';
import useInspectionStore from '../../../store/inspectionStore';
import useDamageStore from '../../../store/damageStore';
import DamageList from './DamageList';
import DamageForm from './DamageForm';

function RightColumn() {
  const [isAddingDamage, setIsAddingDamage] = useState(false);
  const { currentImage, referenceNo } = useInspectionStore();
  const { 
    annotations, 
    currentImageCost, 
    totalCost, 
    loading, 
    error,
    fetchAnnotations,
    deleteAnnotation 
  } = useDamageStore();

  useEffect(() => {
    if (currentImage && referenceNo) {
      fetchAnnotations(referenceNo, currentImage.imageName);
    }
  }, [currentImage, referenceNo, fetchAnnotations]);

  if (!currentImage) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <p className="text-gray-500">Select an image to view damage details</p>
      </div>
    );
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this damage annotation?')) {
      await deleteAnnotation(id, referenceNo, currentImage.imageName);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {isAddingDamage ? (
        <DamageForm
          referenceNo={referenceNo}
          imageName={currentImage.imageName}
          onCancel={() => setIsAddingDamage(false)}
          onSuccess={() => {
            setIsAddingDamage(false);
            fetchAnnotations(referenceNo, currentImage.imageName);
          }}
        />
      ) : (
        <DamageList
          annotations={annotations}
          currentImageCost={currentImageCost}
          totalCost={totalCost}
          loading={loading}
          error={error}
          onAddDamage={() => setIsAddingDamage(true)}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default RightColumn;