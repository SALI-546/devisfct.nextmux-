import React, { useState } from "react";
import {
    ChevronLeft, ChevronRight, Calendar
} from 'lucide-react';

const CustomDatePicker = ({ value, onChange }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date(value || new Date()));
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);

    const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    // Générer les jours du mois
    const generateCalendarDays = () => {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const daysInMonth = [];
        const startDayIndex = (startOfMonth.getDay() + 6) % 7; // Commence avec lundi

        // Ajouter des jours vides avant le 1er
        for (let i = 0; i < startDayIndex; i++) {
            daysInMonth.push(null);
        }

        // Ajouter les jours du mois
        for (let i = 1; i <= endOfMonth.getDate(); i++) {
            daysInMonth.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }

        return daysInMonth;
    };

    const handleDayClick = (date) => {
        setSelectedDate(date);
        setIsCalendarOpen(false);
        onChange(date.toLocaleDateString('fr-CA')); // Format `YYYY-MM-DD`
    };

    const handleMonthChange = (direction) => {
        setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
    };

    const renderCalendar = () => {
        const days = generateCalendarDays();

        return (
            <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg p-3">
                <div className="flex items-center justify-between mb-3">
                    <button
                        onClick={() => handleMonthChange(-1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                    >
                        <ChevronLeft size={20} className="text-gray-600 hover:text-nextmux-green" />
                    </button>
                    <span className="text-lg font-semibold text-gray-800">
                        {currentDate.toLocaleString("fr-FR", {
                            month: "long",
                            year: "numeric",
                        }).charAt(0).toUpperCase() +
                            currentDate.toLocaleString("fr-FR", {
                                month: "long",
                                year: "numeric",
                            }).slice(1)}
                    </span>
                    <button
                        onClick={() => handleMonthChange(1)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                    >
                        <ChevronRight size={20} className="text-gray-600 hover:text-nextmux-green" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-3 text-center">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className={`
                w-8 h-8 flex items-center justify-center 
                rounded-full 
                cursor-pointer 
                text-sm
                ${day
                                    ? day.toDateString() ===
                                        (selectedDate && selectedDate.toDateString())
                                        ? "bg-nextmux-green text-white"
                                        : "hover:bg-gray-200"
                                    : ""
                                }
            `}
                            onClick={() => day && handleDayClick(day)}
                        >
                            {day ? day.getDate() : ""}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="relative">
            {/* Champ d'entrée */}
            <div className="flex items-center border rounded shadow-sm focus-within:ring-2 focus-within:ring-nextmux-green relative">
                <input
                    type="text"
                    value={selectedDate ? selectedDate.toLocaleDateString("fr-FR") : ""}
                    onFocus={() => setIsCalendarOpen(true)}
                    onChange={() => { }}
                    placeholder="Sélectionnez une date"
                    className="w-full p-3 pr-10 focus:outline-none"
                />
                <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="absolute right-2 flex items-center justify-center p-2 rounded hover:bg-gray-200 transition-colors"
                >
                    <Calendar size={20} className="text-gray-500" />
                </button>
            </div>

            {/* Affichage du calendrier */}
            {isCalendarOpen && renderCalendar()}
        </div>
    );
};

export default CustomDatePicker;
