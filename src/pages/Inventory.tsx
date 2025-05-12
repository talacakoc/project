import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useAppContext } from '../context/AppContext';
import { StockItem, SortConfig } from '../types';
import { Plus, Edit2, Trash2, ArrowLeftRight, Eye } from 'lucide-react';
import Badge from '../components/common/Badge';

const Inventory: React.FC = () => {
  const {
    stockItems,
    categories,
    units,
    addStockItem,
    updateStockItem,
    deleteStockItem,
  } = useAppContext();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<StockItem | null>(null);
  const [formData, setFormData] = useState<Partial<StockItem>>({
    name: '',
    category: '',
    unit: '',
    stockCode: '',
    quantity: 0,
    criticalLevel: 0,
    purchasePrice: 0,
    salePrice: 0,
    description: '',
  });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'name',
    direction: 'asc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    // Convert numeric fields to numbers
    if (
      ['quantity', 'criticalLevel', 'purchasePrice', 'salePrice'].includes(name) &&
      value !== ''
    ) {
      parsedValue = parseFloat(value);
    }

    setFormData({ ...formData, [name]: parsedValue });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      unit: '',
      stockCode: '',
      quantity: 0,
      criticalLevel: 0,
      purchasePrice: 0,
      salePrice: 0,
      description: '',
    });
  };

  const handleAddItem = () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.unit ||
      !formData.stockCode
    ) {
      alert('Lütfen zorunlu alanları doldurun.');
      return;
    }

    addStockItem(formData as Omit<StockItem, 'id' | 'createdAt' | 'updatedAt'>);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditItem = () => {
    if (!currentItem) return;

    if (
      !formData.name ||
      !formData.category ||
      !formData.unit ||
      !formData.stockCode
    ) {
      alert('Lütfen zorunlu alanları doldurun.');
      return;
    }

    updateStockItem(currentItem.id, formData);
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteItem = () => {
    if (!currentItem) return;
    deleteStockItem(currentItem.id);
    setIsDeleteModalOpen(false);
    setCurrentItem(null);
  };

  const openEditModal = (item: StockItem) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit,
      stockCode: item.stockCode,
      quantity: item.quantity,
      criticalLevel: item.criticalLevel,
      purchasePrice: item.purchasePrice,
      salePrice: item.salePrice,
      description: item.description,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item: StockItem) => {
    setCurrentItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleSort = (config: SortConfig) => {
    setSortConfig(config);
  };

  // Filter and sort items
  const filteredItems = stockItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.stockCode.toLowerCase().includes(search.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((item) => (categoryFilter ? item.category === categoryFilter : true));

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortConfig.key as keyof StockItem];
    const bValue = b[sortConfig.key as keyof StockItem];

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { key: 'stockCode', header: 'Stok Kodu', sortable: true },
    { key: 'name', header: 'Ürün Adı', sortable: true },
    { 
      key: 'category', 
      header: 'Kategori', 
      sortable: true,
      render: (item: StockItem) => (
        <Badge variant="secondary">{item.category}</Badge>
      )
    },
    { key: 'unit', header: 'Birim', sortable: true },
    { 
      key: 'quantity', 
      header: 'Miktar', 
      sortable: true,
      render: (item: StockItem) => (
        <span className={item.quantity <= item.criticalLevel ? 'text-red-600 font-medium' : ''}>
          {item.quantity}
        </span>
      )
    },
    { 
      key: 'purchasePrice', 
      header: 'Alış Fiyatı', 
      sortable: true,
      render: (item: StockItem) => `${item.purchasePrice.toLocaleString('tr-TR')} ₺`
    },
    { 
      key: 'salePrice', 
      header: 'Satış Fiyatı', 
      sortable: true,
      render: (item: StockItem) => `${item.salePrice.toLocaleString('tr-TR')} ₺`
    },
    {
      key: 'actions',
      header: 'İşlemler',
      render: (item: StockItem) => (
        <div className="flex space-x-2">
          <button
            onClick={() => openEditModal(item)}
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
            title="Düzenle"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => openDeleteModal(item)}
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Envanter</h1>
          <p className="text-gray-600">Stok ürünlerini yönetin</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
          Yeni Ürün Ekle
        </Button>
      </div>

      <Card className="border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Ürün ara..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Tüm Kategoriler</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Table
          data={paginatedItems}
          columns={columns}
          keyExtractor={(item) => item.id}
          onSort={handleSort}
          pagination={{
            itemsPerPage,
            currentPage,
            onPageChange: setCurrentPage,
            totalItems,
          }}
        />
      </Card>

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          resetForm();
        }}
        title="Yeni Ürün Ekle"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="mr-2"
            >
              İptal
            </Button>
            <Button variant="primary" onClick={handleAddItem}>
              Ekle
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ürün Adı *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
          />
          <Input
            label="Stok Kodu *"
            name="stockCode"
            value={formData.stockCode}
            onChange={handleInputChange}
            fullWidth
          />
          <Select
            label="Kategori *"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={categories.map((cat) => ({ value: cat.name, label: cat.name }))}
            fullWidth
          />
          <Select
            label="Birim *"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            options={units.map((unit) => ({ value: unit.name, label: unit.name }))}
            fullWidth
          />
          <Input
            label="Miktar"
            type="number"
            name="quantity"
            value={formData.quantity?.toString()}
            onChange={handleInputChange}
            fullWidth
          />
          <Input
            label="Kritik Stok Seviyesi"
            type="number"
            name="criticalLevel"
            value={formData.criticalLevel?.toString()}
            onChange={handleInputChange}
            fullWidth
          />
          <Input
            label="Alış Fiyatı (₺)"
            type="number"
            name="purchasePrice"
            value={formData.purchasePrice?.toString()}
            onChange={handleInputChange}
            fullWidth
          />
          <Input
            label="Satış Fiyatı (₺)"
            type="number"
            name="salePrice"
            value={formData.salePrice?.toString()}
            onChange={handleInputChange}
            fullWidth
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          resetForm();
        }}
        title="Ürün Düzenle"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                resetForm();
              }}
              className="mr-2"
            >
              İptal
            </Button>
            <Button variant="primary" onClick={handleEditItem}>
              Kaydet
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ürün Adı *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
          />
          <Input
            label="Stok Kodu *"
            name="stockCode"
            value={formData.stockCode}
            onChange={handleInputChange}
            fullWidth
          />
          <Select
            label="Kategori *"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={categories.map((cat) => ({ value: cat.name, label: cat.name }))}
            fullWidth
          />
          <Select
            label="Birim *"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            options={units.map((unit) => ({ value: unit.name, label: unit.name }))}
            fullWidth
          />
          <Input
            label="Miktar"
            type="number"
            name="quantity"
            value={formData.quantity?.toString()}
            onChange={handleInputChange}
            fullWidth
          />
          <Input
            label="Kritik Stok Seviyesi"
            type="number"
            name="criticalLevel"
            value={formData.criticalLevel?.toString()}
            onChange={handleInputChange}
            fullWidth
          />
          <Input
            label="Alış Fiyatı (₺)"
            type="number"
            name="purchasePrice"
            value={formData.purchasePrice?.toString()}
            onChange={handleInputChange}
            fullWidth
          />
          <Input
            label="Satış Fiyatı (₺)"
            type="number"
            name="salePrice"
            value={formData.salePrice?.toString()}
            onChange={handleInputChange}
            fullWidth
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Ürünü Sil"
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              className="mr-2"
            >
              İptal
            </Button>
            <Button variant="danger" onClick={handleDeleteItem}>
              Sil
            </Button>
          </>
        }
      >
        <p>
          <strong>{currentItem?.name}</strong> ürününü silmek istediğinize emin misiniz?
          Bu işlem geri alınamaz.
        </p>
      </Modal>
    </div>
  );
};

export default Inventory;