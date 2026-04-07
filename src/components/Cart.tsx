import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'

interface Dish {
  id: string
  name: string
  price: number
  category: string
  rating: number
  time: string
  image: string
  description: string
}

interface CartItem extends Dish {
  quantity: number
}

interface CartProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (id: string, delta: number) => void
  onRemove: (id: string) => void
  deliveryFee: number
  onCheckout: () => void
}

export const Cart = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, deliveryFee, onCheckout }: CartProps) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const total = subtotal + deliveryFee

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center bg-orange-50/50">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-red-100">
                  <ShoppingCart size={20} />
                </div>
                <h2 className="text-xl font-black text-gray-900">Your Basket</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white rounded-full transition-colors border-2 border-transparent hover:border-gray-100"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                  <div className="w-24 h-24 bg-orange-100/50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingCart size={40} className="text-primary opacity-50" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cart is empty</h3>
                  <p className="text-gray-500 mb-8">Good food is always just a few clicks away. Start adding!</p>
                  <button 
                    onClick={onClose}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-hover transition-all"
                  >
                    View Menu
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    key={item.id}
                    className="flex gap-4 bg-orange-50/30 p-4 rounded-3xl group"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-bold text-gray-900 leading-tight">{item.name}</h4>
                        <button 
                          onClick={() => onRemove(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-primary font-black text-lg mb-3">₹{item.price * item.quantity}</p>
                      
                      <div className="flex items-center gap-4 bg-white self-start px-3 py-1.5 rounded-full shadow-sm border border-orange-100/50">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="hover:text-primary transition-colors disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-bold text-gray-900 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="hover:text-primary transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t bg-white relative z-10">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="font-bold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between mb-8">
                  <span className="text-gray-500 font-medium">Delivery Fee</span>
                  <span className="text-gray-900 font-bold">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between mb-8 pt-4 border-t border-dashed">
                  <span className="text-xl font-bold">Total Amount</span>
                  <span className="text-2xl font-black text-primary">₹{total}</span>
                </div>
                
                <button 
                  onClick={onCheckout}
                  className="w-full bg-primary text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-primary-hover transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 group"
                >
                  Proceed to Checkout
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
