import React from 'react';
import Card from '../components/common/Card';
import { useAppContext } from '../context/AppContext';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { stockItems, stockMovements } = useAppContext();

  // Toplam ürün sayısı
  const totalProducts = stockItems.length;

  // Toplam stok değeri
  const totalStockValue = stockItems.reduce(
    (total, item) => total + item.quantity * item.purchasePrice,
    0
  );

  // Kritik stokta olan ürünler
  const criticalStock = stockItems.filter(
    (item) => item.quantity <= item.criticalLevel
  );

  // Son stok hareketleri
  const recentMovements = [...stockMovements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Stok giriş ve çıkışları (son 7 gün)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentInflow = stockMovements
    .filter(
      (m) => m.type === 'in' && new Date(m.date) >= sevenDaysAgo
    )
    .reduce((sum, m) => sum + m.quantity, 0);

  const recentOutflow = stockMovements
    .filter(
      (m) => m.type === 'out' && new Date(m.date) >= sevenDaysAgo
    )
    .reduce((sum, m) => sum + m.quantity, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Stok durumuna genel bakış</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Toplam Ürün</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalProducts}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/inventory"
              className="text-blue-600 text-sm hover:underline"
            >
              Envanteri Görüntüle →
            </Link>
          </div>
        </Card>

        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Toplam Stok Değeri</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {totalStockValue.toLocaleString('tr-TR')} ₺
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/reports"
              className="text-blue-600 text-sm hover:underline"
            >
              Raporları Görüntüle →
            </Link>
          </div>
        </Card>

        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Stok Girişi (7 gün)</p>
              <h3 className="text-2xl font-bold text-gray-800">{recentInflow}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/movements"
              className="text-blue-600 text-sm hover:underline"
            >
              Tüm Hareketleri Görüntüle →
            </Link>
          </div>
        </Card>

        <Card className="border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Stok Çıkışı (7 gün)</p>
              <h3 className="text-2xl font-bold text-gray-800">{recentOutflow}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/movements"
              className="text-blue-600 text-sm hover:underline"
            >
              Tüm Hareketleri Görüntüle →
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kritik Stok Seviyeleri */}
        <Card
          title="Kritik Stok Seviyeleri"
          className="border border-gray-200 lg:col-span-1"
        >
          <div className="space-y-3">
            {criticalStock.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Kritik seviyede ürün bulunmuyor
              </p>
            ) : (
              criticalStock.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center">
                    <div className="bg-red-100 p-2 rounded-md mr-3">
                      <AlertTriangle size={16} className="text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Stok: {item.quantity} / Kritik: {item.criticalLevel}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/inventory?id=${item.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Görüntüle
                  </Link>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Son Hareketler */}
        <Card
          title="Son Hareketler"
          className="border border-gray-200 lg:col-span-2"
        >
          <div className="space-y-3">
            {recentMovements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-md mr-3 ${
                      movement.type === 'in'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
                  >
                    {movement.type === 'in' ? (
                      <TrendingUp
                        size={16}
                        className="text-green-600"
                      />
                    ) : (
                      <TrendingDown
                        size={16}
                        className="text-red-600"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {movement.stockItemName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {movement.reason} - {movement.quantity} adet
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(movement.date).toLocaleDateString('tr-TR')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {movement.performedBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link
              to="/movements"
              className="text-blue-600 hover:underline text-sm"
            >
              Tüm hareketleri görüntüle
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;