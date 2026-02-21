'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import DriverForm from './DriverForm'

export default function AddDriverWrapper() {
    const [isOpen, setIsOpen] = useState(false)

    if (isOpen) {
        return (
            <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50 p-4">
                <div className="max-w-lg w-full bg-white rounded-xl shadow-xl overflow-hidden relative">
                    <DriverForm
                        onSuccess={() => setIsOpen(false)}
                        onCancel={() => setIsOpen(false)}
                    />
                </div>
            </div>
        )
    }

    return (
        <Button
            onClick={() => setIsOpen(true)}
            className="bg-[#6324eb] hover:bg-[#521dc4]"
        >
            <Plus className="w-4 h-4 mr-2" />
            Add Driver
        </Button>
    )
}
