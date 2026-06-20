import React, { useState } from 'react';
import { Button, Input, Modal, Toast, Loader } from '../components/ui';
import ThemeToggle from '../components/ThemeToggle';

const ComponentShowcase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [formData, setFormData] = useState({ email: '', message: '' });

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type, duration: 3000 }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 p-4 md:p-8">
      {/* Header with Theme Toggle */}
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Component Showcase</h1>
        <ThemeToggle />
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Button Components */}
        <div className="space-y-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">Buttons</h2>
          <Button variant="primary" size="md">Primary Button</Button>
          <Button variant="secondary" size="md">Secondary Button</Button>
          <Button variant="outline" size="md">Outline Button</Button>
          <Button variant="ghost" size="md">Ghost Button</Button>
          <Button disabled size="md">Disabled Button</Button>
          <div className="flex gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        {/* Input Components */}
        <div className="space-y-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">Inputs</h2>
          <Input
            label="Email Address"
            placeholder="user@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          <Input
            label="Error State"
            placeholder="This has an error"
            error="This field is required"
          />
          <Input
            label="Disabled Input"
            placeholder="Cannot edit this"
            disabled
          />
        </div>

        {/* Loaders */}
        <div className="space-y-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold">Loaders</h2>
          <div className="flex gap-4 items-center">
            <Loader size="sm" variant="spinner" />
            <Loader size="md" variant="spinner" />
            <Loader size="lg" variant="spinner" />
          </div>
          <Loader variant="pulse" />
          <Loader variant="skeleton" />
        </div>

        {/* Modal Demo */}
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Modal</h2>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
          >
            <div className="space-y-4">
              <p>This modal supports:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Focus trap (Tab navigation)</li>
                <li>Close on Escape key</li>
                <li>Click backdrop to close</li>
              </ul>
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(false)}
              >
                Close Modal
              </Button>
            </div>
          </Modal>
        </div>

        {/* Toast Demo */}
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Toast Notifications</h2>
          <div className="space-y-2">
            <Button
              size="sm"
              onClick={() => addToast('Success! Operation completed', 'success')}
            >
              Success
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => addToast('Error! Something went wrong', 'error')}
            >
              Error
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addToast('Info message', 'info')}
            >
              Info
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => addToast('Warning! Be careful', 'warning')}
            >
              Warning
            </Button>
          </div>
        </div>

        {/* Responsive Testing Info */}
        <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Responsive Breakpoints</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Mobile:</strong> 375px (visible)</p>
            <p><strong>Tablet:</strong> 768px (md:)</p>
            <p><strong>Desktop:</strong> 1440px (lg:)</p>
            <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
              Resize your browser to test responsive behavior
            </p>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentShowcase;
