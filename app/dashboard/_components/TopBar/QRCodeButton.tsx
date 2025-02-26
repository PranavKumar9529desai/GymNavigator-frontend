'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { QrCode } from 'lucide-react';
import Image from 'next/image';
import { type FC, useState } from 'react';

interface QRCodeButtonProps {
  gymId?: string;
}

const QRCodeButton: FC<QRCodeButtonProps> = () => {
  const [showQR, setShowQR] = useState(false);

  const toggleQR = () => {
    setShowQR(!showQR);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleQR}
        className="p-2 rounded-full hover:bg-gray-100 transition flex items-center justify-center"
        aria-label="QR Code"
      >
        <QrCode className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {showQR && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-10 md:hidden"
              onClick={() => setShowQR(false)}
            />

            {/* QR Code modal */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="absolute right-0 mt-2 p-5 bg-white rounded-lg shadow-lg z-20 border"
            >
              <div className="text-center mb-3">
                <h3 className="font-medium text-lg">Gym QR Code</h3>
                <p className="text-xs text-gray-500 mt-1">Scan to check in at the gym</p>
              </div>

              <div className="relative h-48 w-48 bg-white p-2 rounded border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-gray-800" strokeWidth={1} />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-12 w-12 bg-white rounded-full p-1.5">
                    <div className="relative h-full w-full rounded-full overflow-hidden">
                      <Image
                        src="/apple-touch-icon.png"
                        alt="Gym Logo"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setShowQR(false)}
                  className="text-sm text-blue-600 font-medium hover:text-blue-800 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRCodeButton;
