import React from "react";
import { Layout, Users, Package, Settings, Eye } from "lucide-react";

const Sidebar = ({ activeSection, setActiveSection, onSave, onShare }) => {
    // Navigation principale pour desktop
    const navigationItems = [
        { section: 'general', icon: Layout, title: 'En-tête' },
        { section: 'client', icon: Users, title: 'Client' },
        { section: 'articles', icon: Package, title: 'Articles' },
        { section: 'conditions', icon: Settings, title: 'Conditions' }
    ];

    // Nouvelle navigation "Aperçu" pour mobile
    const navigationItemsMobile = [
        { section: 'Aperçu', icon: Eye, title: 'Aperçu' }
    ];

    return (
        <>
            {/* Version desktop */}
            <div className="hidden md:flex w-16 bg-white shadow-lg flex-col h-full">
                <nav className="flex flex-col p-2 flex-1 space-y-2">
                    {navigationItems.map(({ section, icon: Icon, title }) => (
                        <div key={section} className="relative group">
                            <button
                                onClick={() => setActiveSection(section)}
                                className={`p-2 rounded flex items-center justify-center w-full ${activeSection === section ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                            >
                                <Icon size={20} />
                            </button>
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                {title}
                            </div>
                        </div>
                    ))}
                </nav>
                <div className="p-2 border-t flex flex-col space-y-2">
                    <p>&copy; DF</p>
                </div>
            </div>

            {/* Version mobile - barre du bas */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden z-50">
                <div className="flex justify-between p-2">
                    {/* Navigation mobile principale */}
                    {navigationItems.map(({ section, icon: Icon, title }) => (
                        <button
                            key={section}
                            onClick={() => setActiveSection(section)}
                            className={`p-2 rounded flex flex-col items-center ${activeSection === section ? 'text-black' : 'text-gray-500'}`}
                        >
                            <Icon size={20} />
                            <span className="text-xs mt-1">{title}</span>
                        </button>
                    ))}

                    {/* Navigation mobile pour "Aperçu" */}
                    {navigationItemsMobile.map(({ section, icon: Icon, title }) => (
                        <button
                            key={section}
                            onClick={() => setActiveSection(section)}
                            className={`p-2 rounded flex flex-col items-center ${activeSection === section ? 'text-black' : 'text-gray-500'}`}
                        >
                            <Icon size={20} />
                            <span className="text-xs mt-1">{title}</span>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
