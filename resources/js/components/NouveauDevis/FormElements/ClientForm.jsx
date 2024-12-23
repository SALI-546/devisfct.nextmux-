// resources/js/components/FormElements/ClientForm.jsx

import React from "react";
import CustomInputSelect from "../CustomizeInputs/CustomInputSelect";

const ClientForm = ({ formData, handleClientChange, handleEmetteurChange, setFormData }) => {
    // Liste des entreprises qui ont déjà été saisies
    const companies = [
        {
            name: "Nextmux SAS",
            email: "contact@nextmux.com",
            telephone: "+229 44 44 44 44",
            adresse: "Rue de la pharmacie de l'étoile",
        },
        {
            name: "Eig Bénin",
            email: "contact@eigb.com",
            telephone: "+229 44 44 44 44",
            adresse: "Carrefour Aïbatin",
        },
        {
            name: "SBEE, SONEB",
            email: "emaildelasoneb@support.com",
            telephone: "+229 44 44 44 44",
            adresse: "789 Boulevard C",
        },
    ];

    const handleCompanyChange = (selectedCompany) => {
        const company = companies.find((c) => c.name === selectedCompany);
        if (company) {
            setFormData((prev) => ({
                ...prev,
                client: {
                    ...prev.client,
                    entreprise: company.name,
                    email: company.email,
                    telephone: company.telephone,
                    adresse: company.adresse,
                },
            }));
        } else {
            // Nouvelle entreprise
            setFormData((prev) => ({
                ...prev,
                client: {
                    ...prev.client,
                    entreprise: selectedCompany,
                    email: "",
                    telephone: "",
                    adresse: "",
                },
            }));
        }
    };

    const handleChange = (field, value) => {
        handleClientChange(field, value);
    };

    // Fonction pour gérer les changements dans les champs de l'émetteur
    const handleEmetteurFieldChange = (field, value) => {
        handleEmetteurChange(field, value);
    };

    return (
        <div className="space-y-8 mb-16">
            {/* Client */}
            <div>
                <h2 className="font-semibold mb-4 text-lg text-dtr-brown">Client</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de l'entreprise ou particulier
                        </label>
                        <CustomInputSelect
                            value={formData.client.entreprise || ""}
                            onChange={handleCompanyChange}
                            options={companies.map((c) => c.name)}
                            placeholder="Entrez un nom"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.client.email || ""}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="email@exemple.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                        <input
                            type="tel"
                            value={formData.client.telephone || ""}
                            onChange={(e) =>
                                handleChange("telephone", e.target.value.replace(/[^+\d\s]/g, ""))
                            }
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="+229 XX XX XX XX"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                        <input
                            type="text"
                            value={formData.client.adresse || ""}
                            onChange={(e) => handleChange("adresse", e.target.value)}
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="123 rue Exemple"
                        />
                    </div>
                </div>
            </div>

            {/* Émetteur */}
            <div>
                <h2 className="font-semibold mb-4 text-lg text-dtr-brown">Émetteur</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'émetteur</label>
                        <input
                            type="text"
                            value={formData.emetteur.nom || ""}
                            onChange={(e) => handleEmetteurFieldChange("nom", e.target.value)}
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="Nom ou entreprise"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.emetteur.email || ""}
                            onChange={(e) => handleEmetteurFieldChange("email", e.target.value)}
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="email@exemple.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                        <input
                            type="tel"
                            value={formData.emetteur.telephone || ""}
                            onChange={(e) =>
                                handleEmetteurFieldChange("telephone", e.target.value.replace(/[^+\d\s]/g, ""))
                            }
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="+229 XX XX XX XX"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                        <input
                            type="text"
                            value={formData.emetteur.adresse || ""}
                            onChange={(e) => handleEmetteurFieldChange("adresse", e.target.value)}
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="Adresse complète"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

};

export default ClientForm;
