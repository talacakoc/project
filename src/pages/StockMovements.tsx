import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import { StockMovement, SortConfig } from '../types';
import { Plus, TrendingUp, TrendingDown } from 'lucide-react';

const StockMovements: React.FC = () => {
  const { stockMovements, stockItems, addStockMovement } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<StockMovement>>({
    stockItemId: '',
    type: 'in',
    quantity: 0,
    reason: '',
    date: new Date(),
    performedBy: 'Ahmet Yılmaz',
    notes: '',
  });
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'in' | 'out'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'date',
    direction: 'desc',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number | Date = value;

    if (name === 'quantity' && value !== '') {
      parsedValue = parseInt(value);
    } else if (name === 'date') {
      parsedValue = new Date(value);
    }

    setFormData({ ...formData, [name]: parsedValue });
  };

  const resetForm = () => {
    setFormData({
      stockItemId: '',
      type: 'in',
      quantity: 0,
      reason: '',
      date: new Date(),
      performedBy: 'Ahmet Yılmaz',
      notes: '',
    });
  };

  const handleAddMovement = () => {
    if (
      !formData.stockItemId ||
      !formData.type ||
      !formData.quantity ||
      !formData.reason ||
      !formData.date ||
      !formData.performedBy
    ) {
      alert('Lütfen zorunlu alanları doldurun.');
      return;
    }

    if (formData.quantity <= 0) {
      alert('Miktar 0\'dan büyük olmalıdır.');
      return;
    }

    const selectedStockItem = stockItems.find(item => item.id === formData.stockItemId);
    
    if (formData.type === 'out' && selectedStockItem && formData.quantity > selectedStockItem.quantity) {
      alert(`Çıkış miktarı mevcut stok miktarından (${selectedStockItem.quantity}) fazla olamaz.`);
      return;
    }

    addStockMovement(formData as Omit<StockMovement, 'id' | 'stockItemName'>);
    setIsModalOpen(false);
    resetForm();
  };

  const handleSort = (config: SortConfig) => {
    setSortConfig(config);
  };

  // Filter movements
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const monthAgo = new Date(today);
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  const filteredMovements = stockMovements.filter((movement) => {
    // Search filter
    const searchMatch =
      movement.stockItemName.toLowerCase().includes(search.toLowerCase()) ||
      movement.reason.toLowerCase().includes(search.toLowerCase()) ||
      (movement.notes && movement.notes.toLowerCase().includes(search.toLowerCase()));

    // Type filter
    const typeMatch = typeFilter === 'all' || movement.type === typeFilter;

    // Date filter
    let dateMatch = true;
    const movementDate = new Date(movement.date);
    
    if (dateFilter === 'today') {
      dateMatch = movementDate >= today;
    } else if (dateFilter === 'week') {
      dateMatch = movementDate >= weekAgo;
    } else if (dateFilter === 'month') {
      dateMatch = movementDate >= monthAgo;
    }

    return searchMatch && typeMatch && dateMatch;
  });

  // Sort movements
  const sortedMovements = [...filteredMovements].sort((a, b) => {
    if (sortConfig.key === 'date') {
      return sortConfig.direction === 'asc'
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }

    const aValue = a[sortConfig.key as keyof StockMovement];
    const bValue = b[sortConfig.key as keyof StockMovement];

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const totalItems = sortedMovements.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedMovements = sortedMovements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { 
      key: 'date', 
      header: 'Tarih', 
      sortable: true,
      render: (item: StockMovement) => new Date(item.date).toLocaleDateString('tr-TR')
    },
    { key: 'stockItemName', header: 'Ürün', sortable: true },
    { 
      key: 'type', 
      header: 'İşlem Türü', 
      sortable: true,
      render: (item: StockMovement) => (
        <Badge variant={item.type === 'in' ? 'success' : 'danger'}>
          {item.type === 'in' ? 'Giriş' : 'Çıkış'}
        </Badge>
      )
    },
    { key: 'quantity', header: 'Miktar', sortable: true },
    { key: 'reason', header: 'Neden', sortable: true },
    { key: 'performedBy', header: 'İşlemi Yapan', sortable: true },
    { 
      key: 'notes', 
      header: 'Notlar',
      render: (item: StockMovement) => item.notes || '-'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Stok Hareketleri</h1>
          <p className="text-gray-600">Stok giriş ve çıkışlarını yönetin</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Yeni Hareket
        </Button>
      </div>

      <Card className="border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Hareket ara..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'in' | 'out')}
            >
              <option value="all">Tüm İşlemler</option>
              <option value="in">Sadece Girişler</option>
              <option value="out">Sadece Çıkışlar</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
            >
              <option value="all">Tüm Tarihler</option>
              <option value="today">Bugün</option>
              <option value="week">Son 7 Gün</option>
              <option value="month">Son 30 Gün</option>
            </select>
          </div>
        </div>

        <Table
          data={paginatedMovements}
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

      {/* Add Movement Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title="Yeni Stok Hareketi"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="mr-2"
            >
              İptal
            </Button>
            <Button variant="primary" onClick={handleAddMovement}>
              Ekle
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Ürün *"
            name="stockItemId"
            value={formData.stockItemId}
            onChange={handleInputChange}
            options={stockItems.map((item) => ({
              value: item.id,
              label: `${item.name} (${item.stockCode}) - Stok: ${item.quantity}`,
            }))}
            fullWidth
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İşlem Türü *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="in"
                  checked={formData.type === 'in'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Giriş</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="out"
                  checked={formData.type === 'out'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Çıkış</span>
              </label>
            </div>
          </div>
          <Input
            label="Miktar *"
            type="number"
            name="quantity"
            value={formData.quantity?.toString()}
            onChange={handleInputChange}
            min="1"
            fullWidth
          />
          <Input
            label="Tarih *"
            type="date"
            name="date"
            value={
              formData.date instanceof Date
                ? formData.date.toISOString().split('T')[0]
                : ''
            }
            onChange={handleInputChange}
            fullWidth
          />
          <Input
            label="İşlemi Yapan *"
            name="performedBy"
            value={formData.performedBy}
            onChange={handleInputChange}
            fullWidth
          />
          <Input
            label="Neden *"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            fullWidth
          />
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notlar
            </label>
            <textarea
              name="notes"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.notes}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StockMovements;