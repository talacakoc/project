import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Category, Unit } from '../types';

const Settings: React.FC = () => {
  const { categories, units, addCategory, deleteCategory, addUnit, deleteUnit } = useAppContext();

  const [activeTab, setActiveTab] = useState<'category' | 'unit'>('category');
  
  // Category state
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Unit state
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isDeleteUnitModalOpen, setIsDeleteUnitModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitAbbreviation, setNewUnitAbbreviation] = useState('');

  // Handle category actions
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert('Kategori adı boş olamaz.');
      return;
    }

    if (categories.some((cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
      alert('Bu kategori zaten mevcut.');
      return;
    }

    addCategory(newCategoryName);
    setNewCategoryName('');
    setIsAddCategoryModalOpen(false);
  };

  const openDeleteCategoryModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteCategoryModalOpen(true);
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setIsDeleteCategoryModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Handle unit actions
  const handleAddUnit = () => {
    if (!newUnitName.trim() || !newUnitAbbreviation.trim()) {
      alert('Birim adı ve kısaltması boş olamaz.');
      return;
    }

    if (units.some((unit) => unit.name.toLowerCase() === newUnitName.toLowerCase())) {
      alert('Bu birim zaten mevcut.');
      return;
    }

    addUnit(newUnitName, newUnitAbbreviation);
    setNewUnitName('');
    setNewUnitAbbreviation('');
    setIsAddUnitModalOpen(false);
  };

  const openDeleteUnitModal = (unit: Unit) => {
    setUnitToDelete(unit);
    setIsDeleteUnitModalOpen(true);
  };

  const handleDeleteUnit = () => {
    if (unitToDelete) {
      deleteUnit(unitToDelete.id);
      setIsDeleteUnitModalOpen(false);
      setUnitToDelete(null);
    }
  };

  // Table columns
  const categoryColumns = [
    { key: 'name', header: 'Kategori Adı', sortable: true },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (item: Category) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openDeleteCategoryModal(item)}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title="Sil"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  const unitColumns = [
    { key: 'name', header: 'Birim Adı', sortable: true },
    { key: 'abbreviation', header: 'Kısaltma', sortable: true },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (item: Unit) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openDeleteUnitModal(item)}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
            title="Sil"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>
        <p className="text-gray-600">Sistem ayarlarını yönetin</p>
      </div>

      <div className="flex border-b">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'category'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('category')}
        >
          Kategoriler
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'unit'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('unit')}
        >
          Birimler
        </button>
      </div>

      {activeTab === 'category' && (
        <Card
          className="border border-gray-200"
          footer={
            <div className="flex justify-end">
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setIsAddCategoryModalOpen(true)}
              >
                Yeni Kategori Ekle
              </Button>
            </div>
          }
        >
          <Table
            data={categories}
            columns={categoryColumns}
            keyExtractor={(item) => item.id}
          />
        </Card>
      )}

      {activeTab === 'unit' && (
        <Card
          className="border border-gray-200"
          footer={
            <div className="flex justify-end">
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => setIsAddUnitModalOpen(true)}
              >
                Yeni Birim Ekle
              </Button>
            </div>
          }
        >
          <Table
            data={units}
            columns={unitColumns}
            keyExtractor={(item) => item.id}
          />
        </Card>
      )}

      {/* Category Modals */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => {
          setIsAddCategoryModalOpen(false);
          setNewCategoryName('');
        }}
        title="Yeni Kategori Ekle"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddCategoryModalOpen(false);
                setNewCategoryName('');
              }}
              className="mr-2"
            >
              İptal
            </Button>
            <Button variant="primary" onClick={handleAddCategory}>
              Ekle
            </Button>
          </>
        }
      >
        <Input
          label="Kategori Adı"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          fullWidth
        />
      </Modal>

      <Modal
        isOpen={isDeleteCategoryModalOpen}
        onClose={() => setIsDeleteCategoryModalOpen(false)}
        title="Kategoriyi Sil"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteCategoryModalOpen(false)}
              className="mr-2"
            >
              İptal
            </Button>
            <Button variant="danger" onClick={handleDeleteCategory}>
              Sil
            </Button>
          </>
        }
      >
        <p>
          <strong>{categoryToDelete?.name}</strong> kategorisini silmek istediğinize emin misiniz?
          Bu işlem geri alınamaz.
        </p>
      </Modal>

      {/* Unit Modals */}
      <Modal
        isOpen={isAddUnitModalOpen}
        onClose={() => {
          setIsAddUnitModalOpen(false);
          setNewUnitName('');
          setNewUnitAbbreviation('');
        }}
        title="Yeni Birim Ekle"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddUnitModalOpen(false);
                setNewUnitName('');
                setNewUnitAbbreviation('');
              }}
              className="mr-2"
            >
              İptal
            </Button>
            <Button variant="primary" onClick={handleAddUnit}>
              Ekle
            </Button>
          </>
        }
      >
        <Input
          label="Birim Adı"
          value={newUnitName}
          onChange={(e) => setNewUnitName(e.target.value)}
          fullWidth
        />
        <Input
          label="Kısaltma"
          value={newUnitAbbreviation}
          onChange={(e) => setNewUnitAbbreviation(e.target.value)}
          fullWidth
        />
      </Modal>

      <Modal
        isOpen={isDeleteUnitModalOpen}
        onClose={() => setIsDeleteUnitModalOpen(false)}
        title="Birimi Sil"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteUnitModalOpen(false)}
              className="mr-2"
            >
              İptal
            </Button>
            <Button variant="danger" onClick={handleDeleteUnit}>
              Sil
            </Button>
          </>
        }
      >
        <p>
          <strong>{unitToDelete?.name}</strong> birimini silmek istediğinize emin misiniz?
          Bu işlem geri alınamaz.
        </p>
      </Modal>
    </div>
  );
};

export default Settings;