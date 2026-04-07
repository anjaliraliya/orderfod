import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, Truck, Utensils, Package, Clock, Phone } from 'lucide-react'

interface DeliveryTrackerProps {
  isOpen: boolean
  onClose: () => void
  orderId?: string
}

const STEPS = [
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'bg-green-500' },
  { id: 'preparing', label: 'Preparing', icon: Utensils, color: 'bg-orange-500' },
  { id: 'on_way', label: 'On the Way', icon: Truck, color: 'bg-blue-500' },
  { id: 'delivered', label: 'Delivered', icon: Package, color: 'bg-primary' }
]

export const DeliveryTracker = ({ isOpen, onClose, orderId }: DeliveryTrackerProps) => {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (isOpen) {
      // Simulate progress for demo
      const timer = setInterval(() => {
        setCurrentStep(prev => (prev < 3 ? prev + 1 : prev))
      }, 5000)
      return () => clearInterval(timer)
    } else {
      setCurrentStep(0)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
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
            className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            {/* Left: Map/Visual Area */}
            <div className="md:w-1/2 bg-orange-50 relative overflow-hidden min-h-[300px]">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                {/* Mock Map Background */}
                <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/0,0,1,0/400x400?access_token=pk.eyJ1IjoiYmFycm9uIiwiYSI6ImNrcX'] bg-cover" />
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    x: currentStep === 2 ? [0, 100, 0] : 0,
                    y: currentStep === 2 ? [0, -20, 0] : 0
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="bg-white p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 border-2 border-primary/20"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Truck size={40} className="animate-bounce" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900">Your Rider is Nearby</p>
                    <p className="text-xs text-gray-500">Rahul • 4.9 ★</p>
                  </div>
                </motion.div>
              </div>

              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                      <img src="https://i.pravatar.cc/100?u=rider" alt="rider" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Rider</p>
                      <p className="text-sm font-black text-gray-900">Rahul Sharma</p>
                    </div>
                  </div>
                  <button className="p-3 bg-primary text-white rounded-xl shadow-lg hover:bg-primary-hover transition-colors">
                    <Phone size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Status Progress */}
            <div className="md:w-1/2 p-10 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">Track Order</h3>
                  <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">ID: {orderId?.slice(0, 8) || 'VCL-8392'}</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-8 relative">
                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gray-100" />
                
                {STEPS.map((step, idx) => {
                  const Icon = step.icon
                  const isActive = idx <= currentStep
                  return (
                    <div key={step.id} className="flex items-center gap-6 relative z-10">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                        isActive ? `${step.color} text-white shadow-lg` : 'bg-white border-2 border-gray-100 text-gray-300'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className={`font-bold transition-colors ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</p>
                        {isActive && idx === currentStep && (
                          <p className="text-xs text-gray-500 animate-pulse">In progress...</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-10 pt-8 border-t border-dashed">
                <div className="flex justify-between items-center bg-orange-50/50 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock size={18} className="text-primary" />
                    <span className="font-bold text-sm">Estimated Time</span>
                  </div>
                  <span className="text-lg font-black text-gray-900">25 Min</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
