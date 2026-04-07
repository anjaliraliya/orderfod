import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Clock, ChevronRight } from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  date: string
  total: number
  status: string
  items: OrderItem[]
}

interface OrderHistoryProps {
  isOpen: boolean
  onClose: () => void
}

export const OrderHistory = ({ isOpen, onClose }: OrderHistoryProps) => {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (isOpen) {
      const savedOrders = JSON.parse(localStorage.getItem('my_orders') || '[]')
      setOrders(savedOrders)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[90] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-gray-900 p-2 rounded-xl text-white">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-black text-gray-900">Order History</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Clock size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-8 text-sm">Treat yourself to some delicious food from Vimla Cloud!</p>
                  <button 
                    onClick={onClose}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-hover transition-all text-sm"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white border-2 border-gray-50 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-orange-50/20">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                        <p className="text-sm font-black text-gray-900">#{(order.id || '').toUpperCase().slice(0, 8)}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-4">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="flex gap-4 items-center">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.quantity} x ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-gray-400 pl-16">+ {order.items.length - 2} more items</p>
                      )}
                    </div>

                    <div className="p-5 bg-gray-50 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Amount</p>
                        <p className="text-lg font-black text-primary">₹{order.total}</p>
                      </div>
                      <button className="flex items-center gap-1 text-sm font-bold text-gray-900 hover:text-primary transition-colors">
                        Details <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
