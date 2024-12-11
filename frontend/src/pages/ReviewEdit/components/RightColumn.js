import { useState, useEffect } from 'react';
import useInspectionStore from '../../../store/inspectionStore';
import useDamageStore from '../../../store/damageStore';
import DamageList from '../../../components/DamageList';
import DamageForm from '../../../components/DamageForm';

function RightColumn() {
  const [isAddingDamage, setIsAddingDamage] = useState(false);
  const [editingDamage, setEditingDamage] = useState(null);
  const { currentImage, referenceNo } = useInspectionStore();
  const { 
    annotations, 
    currentImageCost, 
    totalCost, 
    loading, 
    error,
    fetchAnnotations,
    addAnnotation,
    updateAnnotation,
    deleteAnnotation 
  } = useDamageStore();

  useEffect(() => {
    if (currentImage && referenceNo) {
      console.log('Fetching annotations for current image:', {
        referenceNo,
        imageName: currentImage.imageName
      });
      fetchAnnotations(referenceNo, currentImage.imageName);
    }
  }, [currentImage, referenceNo, fetchAnnotations]);

  const handleAddSuccess = async (data) => {
    await addAnnotation(data);
    setIsAddingDamage(false);
  };

  const handleEditSuccess = async (data) => {
    await updateAnnotation(data.id, data);
    setEditingDamage(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this damage annotation?')) {
      await deleteAnnotation(id, referenceNo, currentImage.imageName);
    }
  };

  if (!currentImage) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <p className="text-gray-500">Select an image to view damage details</p>
      </div>
    );
  }

  if (isAddingDamage) {
    return (
      <DamageForm
        referenceNo={referenceNo}
        imageName={currentImage.imageName}
        onCancel={() => setIsAddingDamage(false)}
        onSuccess={handleAddSuccess}
      />
    );
  }

  if (editingDamage) {
    return (
      <DamageForm
        referenceNo={referenceNo}
        imageName={currentImage.imageName}
        initialData={editingDamage}
        onCancel={() => setEditingDamage(null)}
        onSuccess={handleEditSuccess}
      />
    );
  }

  console.log('Rendering DamageList with:', {
    annotations,
    currentImageCost,
    totalCost,
    loading,
    error
  });

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <DamageList
        annotations={annotations}
        currentImageCost={currentImageCost}
        totalCost={totalCost}
        loading={loading}
        error={error}
        onAddDamage={() => setIsAddingDamage(true)}
        onEdit={setEditingDamage}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default RightColumn;