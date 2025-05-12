import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download } from 'lucide-react';
import Button from '../components/common/Button';

const Reports: React.FC = () => {
  const { stockItems, stockMovements, categories } = useAppContext();
  const [reportType, setReportType] = useState<'inventory' | 'category' | 'movement'>('inventory');

  // Stok değeri en yüksek ürünler (ilk 10)
  const topValueItems = [...stockItems]
    .sort((a, b) => b.quantity * b.purchasePrice - a.quantity * a.purchasePrice)
    .slice(0, 10)
    .map((item) => ({
      name: item.name,
      value: item.quantity * item.purchasePrice,
    }));

  // Kategorilere göre stok değeri
  const categoryData = categories.map((category) => {
    const categoryItems = stockItems.filter((item) => item.category === category.name);
    const totalValue = categoryItems.reduce(
      (sum, item) => sum + item.quantity * item.purchasePrice,
      0
    );
    return {
      name: category.name,
      value: totalValue,
    };
  }).sort((a, b) => b.value - a.value);

  // Son 30 günlük stok hareketleri
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const last30DaysMovements = stockMovements.filter(
    (movement) => new Date(movement.date) >= thirtyDaysAgo
  );

  // Günlük hareket sayıları
  const movementsByDate = last30DaysMovements.reduce((acc: Record<string, any>, movement) => {
    const dateStr = new Date(movement.date).toLocaleDateString('tr-TR');
    
    if (!acc[dateStr]) {
      acc[dateStr] = {
        date: dateStr,
        in: 0,
        out: 0,
      };
    }
    
    if (movement.type === 'in') {
      acc[dateStr].in += movement.quantity;
    } else {
      acc[dateStr].out += movement.quantity;
    }
    
    return acc;
  }, {});

  const movementData = Object.values(movementsByDate).sort((a: any, b: any) => {
    const dateA = new Date(a.date.split('.').reverse().join('-'));
    const dateB = new Date(b.date.split('.').reverse().join('-'));
    return dateA.getTime() - dateB.getTime();
  });

  // Renk skalası
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Raporlar</h1>
        <p className="text-gray-600">Stok verilerinizin analizlerini görüntüleyin</p>
      </div>

      <div className="flex space-x-2 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${
            reportType === 'inventory'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setReportType('inventory')}
        >
          Envanter Değeri
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            reportType === 'category'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setReportType('category')}
        >
          Kategori Analizi
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            reportType === 'movement'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setReportType('movement')}
        >
          Stok Hareketleri
        </button>
      </div>

      {reportType === 'inventory' && (
        <Card
          title="En Yüksek Değere Sahip Stoklar"
          className="border border-gray-200"
          footer={
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" icon={FileText}>
                PDF Olarak İndir
              </Button>
            </div>
          }
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topValueItems}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                      minimumFractionDigits: 0,
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                      minimumFractionDigits: 2,
                    }).format(Number(value))
                  }
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Stok Değeri"
                  fill="#2563EB"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {reportType === 'category' && (
        <Card
          title="Kategorilere Göre Stok Değeri"
          className="border border-gray-200"
          footer={
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" icon={FileText}>
                PDF Olarak İndir
              </Button>
            </div>
          }
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat('tr-TR', {
                      style: 'currency',
                      currency: 'TRY',
                      minimumFractionDigits: 2,
                    }).format(Number(value))
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {reportType === 'movement' && (
        <Card
          title="Son 30 Gün Stok Hareketleri"
          className="border border-gray-200"
          footer={
            <div className="flex justify-end">
              <Button variant="secondary" size="sm" icon={FileText}>
                PDF Olarak İndir
              </Button>
            </div>
          }
        >
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={movementData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="in"
                  name="Giriş"
                  stackId="a"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="out"
                  name="Çıkış"
                  stackId="a"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Özet istatistikler */}
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-medium text-gray-700 mb-2">Toplam Ürün</h3>
          <p className="text-2xl font-bold text-gray-800">{stockItems.length}</p>
          <div className="mt-2 text-sm text-gray-500">
            {categories.length} farklı kategori
          </div>
        </Card>

        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-medium text-gray-700 mb-2">Toplam Stok Değeri</h3>
          <p className="text-2xl font-bold text-gray-800">
            {stockItems
              .reduce((sum, item) => sum + item.quantity * item.purchasePrice, 0)
              .toLocaleString('tr-TR')}{' '}
            ₺
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Alış fiyatı üzerinden
          </div>
        </Card>

        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-medium text-gray-700 mb-2">Kritik Stok Sayısı</h3>
          <p className="text-2xl font-bold text-gray-800">
            {stockItems.filter((item) => item.quantity <= item.criticalLevel).length}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Kritik seviyede veya altında
          </div>
        </Card>

        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="font-medium text-gray-700 mb-2">Son 30 Gün Hareket</h3>
          <p className="text-2xl font-bold text-gray-800">{last30DaysMovements.length}</p>
          <div className="mt-2 text-sm text-gray-500">
            {last30DaysMovements.filter((m) => m.type === 'in').length} giriş,{' '}
            {last30DaysMovements.filter((m) => m.type === 'out').length} çıkış
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;