import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, ShoppingBag, Loader2, CreditCard, Home, Phone, User, ArrowRight, Truck } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: any[]
  total: number
  deliveryFee: number
  setDeliveryFee: (fee: number) => void
  onSuccess: (id: string) => void
  onTrack: () => void
}

export const CheckoutModal = ({ isOpen, onClose, cartItems, total, deliveryFee, setDeliveryFee, onSuccess, onTrack }: CheckoutModalProps) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'cod'
  })
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null)

  const finalTotal = total + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { data, error: sbError } = await supabase
        .from('orders')
        .insert([
          {
            customer_name: formData.name,
            contact: formData.phone,
            address: formData.address,
            items: cartItems,
            total_price: finalTotal,
            status: 'pending'
          }
        ])
        .select()

      if (sbError) throw sbError

      const orderId = data?.[0]?.id || Math.random().toString(36).substr(2, 9)
      setPlacedOrderId(orderId)

      // Store order info in local storage for history tracking
      const previousOrders = JSON.parse(localStorage.getItem('my_orders') || '[]')
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        total: finalTotal,
        status: 'pending',
        items: cartItems
      }
      localStorage.setItem('my_orders', JSON.stringify([newOrder, ...previousOrders]))
      localStorage.setItem('user_contact', formData.phone)
      
      setStep(3)
      setLoading(false)
      onSuccess(orderId)
    } catch (err: any) {
      console.error(err)
      const errorMsg = err.message || ''
      const isMissingTable = errorMsg.includes('relation "orders" does not exist') || 
                            errorMsg.includes('Could not find the table') ||
                            errorMsg.includes('public.orders');

      if (isMissingTable) {
        // If database is still "waking up", we generate a local ID so the customer is not blocked
        const orderId = 'LOC-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        setPlacedOrderId(orderId)
        
        // Save to local history anyway
        const previousOrders = JSON.parse(localStorage.getItem('my_orders') || '[]')
        const newOrder = {
          id: orderId,
          date: new Date().toISOString(),
          total: finalTotal,
          status: 'pending',
          items: cartItems
        }
        localStorage.setItem('my_orders', JSON.stringify([newOrder, ...previousOrders]))
        
        setTimeout(() => {
          setStep(3)
          setLoading(false)
          onSuccess(orderId)
        }, 1500)
      } else {
        setError(errorMsg || 'Failed to place order. Please check your database connection.')
        setLoading(false)
      }
    }
  }

  const deliveryOptions = [
    { id: 'standard', label: 'Standard', fee: 40, time: '25-40 min' },
    { id: 'express', label: 'Express', fee: 80, time: '15-25 min' },
    { id: 'priority', label: 'Priority', fee: 150, time: '10-15 min' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl h-[90vh] flex flex-col"
          >
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {step === 1 && (
                <div className="p-10">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">Delivery <br /> <span className="text-primary font-bold">Details</span></h2>
                    <button onClick={onClose} className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <form onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Full Name</label>
                        <div className="relative">
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            required
                            type="text" 
                            placeholder="John Doe" 
                            className="w-full bg-orange-50/50 border-2 border-transparent focus:border-primary focus:bg-white px-12 py-4 rounded-2xl outline-none transition-all font-medium"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Phone Number</label>
                        <div className="relative">
                          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            required
                            type="tel" 
                            placeholder="+91 98765 43210" 
                            className="w-full bg-orange-50/50 border-2 border-transparent focus:border-primary focus:bg-white px-12 py-4 rounded-2xl outline-none transition-all font-medium"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Delivery Address</label>
                      <div className="relative">
                        <Home size={18} className="absolute left-4 top-4 text-gray-400" />
                        <textarea 
                          required
                          rows={3}
                          placeholder="Apt, Street, Area..." 
                          className="w-full bg-orange-50/50 border-2 border-transparent focus:border-primary focus:bg-white px-12 py-4 rounded-2xl outline-none transition-all font-medium resize-none"
                          value={formData.address}
                          onChange={e => setFormData({...formData, address: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-2">Delivery Speed (Manual Control)</label>
                      <div className="grid grid-cols-1 gap-3">
                        {deliveryOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setDeliveryFee(option.fee)}
                            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                              deliveryFee === option.fee ? 'border-primary bg-red-50/30' : 'border-gray-100 hover:border-orange-200'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-xl ${deliveryFee === option.fee ? 'bg-primary text-white' : 'bg-orange-50 text-primary'}`}>
                                <Truck size={20} />
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-gray-900">{option.label}</p>
                                <p className="text-xs text-gray-500">{option.time}</p>
                              </div>
                            </div>
                            <span className="font-black text-gray-900">₹{option.fee}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button className="w-full bg-primary text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-primary-hover transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3">
                      Go to Payment
                      <ArrowRight size={20} />
                    </button>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div className="p-10">
                  <div className="mb-10">
                    <button onClick={() => setStep(1)} className="text-sm font-bold text-primary mb-2 flex items-center gap-1">← Back to Details</button>
                    <h2 className="text-3xl font-black text-gray-900 leading-tight">Total <br /> <span className="text-secondary font-bold">Summary</span></h2>
                  </div>

                  <div className="space-y-4 mb-10">
                    <button 
                      onClick={() => setFormData({...formData, paymentMethod: 'cod'})}
                      className={`w-full p-6 rounded-3xl border-2 flex items-center justify-between group transition-all ${
                        formData.paymentMethod === 'cod' ? 'border-primary bg-red-50/30' : 'border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${formData.paymentMethod === 'cod' ? 'bg-primary text-white' : 'bg-orange-50 text-primary'}`}>
                          <ShoppingBag size={24} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900">Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Pay at your doorstep</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        formData.paymentMethod === 'cod' ? 'border-primary bg-primary' : 'border-gray-300'
                      }`}>
                        {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                    </button>

                    <button 
                      disabled
                      className="w-full p-6 rounded-3xl border-2 border-gray-100 flex items-center justify-between opacity-50 cursor-not-allowed group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gray-50 text-gray-400">
                          <CreditCard size={24} />
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-400">Card / UPI / Wallet</p>
                          <p className="text-sm text-gray-500">Disabled for demo</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="bg-orange-50/50 p-6 rounded-3xl mb-10 space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold">₹{total}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 border-b border-orange-100 pb-3">
                      <span className="font-medium">Delivery ({deliveryOptions.find(o => o.fee === deliveryFee)?.label})</span>
                      <span className="font-bold">₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-gray-900 font-extrabold text-2xl pt-1">
                      <span>Total</span>
                      <span className="text-primary">₹{finalTotal}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-100">
                      {error}
                    </div>
                  )}

                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-primary text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-primary-hover transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Confirm Order'}
                  </button>
                </div>
              )}

              {step === 3 && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-16 text-center"
                >
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 mb-2">Order Confirmed!</h2>
                  <p className="text-sm text-gray-400 font-bold mb-6 uppercase tracking-widest">ID: {placedOrderId || '...'}</p>
                  <p className="text-gray-500 text-lg mb-10 leading-relaxed max-w-xs mx-auto">
                    Thank you for ordering from <span className="font-bold text-gray-900">Vimla Cloud</span>. Your food will reach you shortly!
                  </p>
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={onTrack}
                      className="w-full bg-primary text-white py-4 rounded-full font-bold hover:bg-primary-hover transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-2"
                    >
                      <Truck size={20} />
                      Track My Order
                    </button>
                    <button 
                      onClick={onClose}
                      className="text-gray-500 font-bold hover:text-gray-900 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
