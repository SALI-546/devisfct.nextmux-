import React from "react";
import CustomInputSelect from "../CustomizeInputs/CustomInputSelect";

const ClientForm = ({ formData, setFormData }) => {
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

    // Gestion du changement d'entreprise pour le client
    const handleCompanyChange = (selectedCompany) => {
        const company = companies.find((c) => c.name === selectedCompany);
        if (company) {
            // Si une entreprise existante est sélectionnée
            setFormData((prev) => ({
                ...prev,
                client: {
                    entreprise: company.name,
                    email: company.email,
                    telephone: company.telephone,
                    adresse: company.adresse,
                },
            }));
        } else {
            // Si un nouveau nom est entré
            setFormData((prev) => ({
                ...prev,
                client: {
                    ...prev.client,
                    entreprise: selectedCompany,
                },
            }));
        }
    };

    // Gestion des modifications des champs
    const handleInputChange = (fieldPath, value) => {
        setFormData((prevState) => {
            const keys = fieldPath.split(".");
            let updatedData = { ...prevState };

            keys.reduce((nestedObj, key, index) => {
                if (index === keys.length - 1) {
                    nestedObj[key] = value;
                } else {
                    if (!nestedObj[key]) nestedObj[key] = {};
                }
                return nestedObj[key];
            }, updatedData);

            return updatedData;
        });
    };

    return (
        <div className="space-y-8 mb-16">
            {/* Formulaire CLIENT */}
            <div>
                <h2 className="font-semibold mb-4 text-lg text-dtr-brown">Client</h2>
                <div className="space-y-4">
                    {/* Nom de l'entreprise ou particulier */}
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

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.client.email || ""}
                            onChange={(e) =>
                                handleInputChange("client.email", e.target.value)
                            }
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="email@exemple.com"
                        />
                    </div>

                    {/* Téléphone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone
                        </label>
                        <input
                            type="tel"
                            value={formData.client.telephone || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "client.telephone",
                                    e.target.value.replace(/[^+\d\s]/g, "")
                                )
                            }
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="+229 XX XX XX XX"
                        />
                    </div>

                    {/* Adresse */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse
                        </label>
                        <input
                            type="text"
                            value={formData.client.adresse || ""}
                            onChange={(e) =>
                                handleInputChange("client.adresse", e.target.value)
                            }
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="123 rue Exemple"
                        />
                    </div>
                </div>
            </div>

            {/* Formulaire ÉMETTEUR */}
            <div>
                <h2 className="font-semibold mb-4 text-lg text-dtr-brown">Émetteur</h2>
                <div className="space-y-4">
                    {/* Nom de l'émetteur */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de l'émetteur
                        </label>
                        <input
                            type="text"
                            value={formData.emetteur.nom || ""}
                            onChange={(e) =>
                                handleInputChange("emetteur.nom", e.target.value)
                            }
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="Nom ou entreprise"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.emetteur.email || ""}
                            onChange={(e) =>
                                handleInputChange("emetteur.email", e.target.value)
                            }
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="email@exemple.com"
                        />
                    </div>

                    {/* Téléphone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone
                        </label>
                        <input
                            type="tel"
                            value={formData.emetteur.telephone || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "emetteur.telephone",
                                    e.target.value.replace(/[^+\d\s]/g, "")
                                )
                            }
                            className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                            placeholder="+229 XX XX XX XX"
                        />
                    </div>

                    {/* Adresse */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse
                        </label>
                        <input
                            type="text"
                            value={formData.emetteur.adresse || ""}
                            onChange={(e) =>
                                handleInputChange("emetteur.adresse", e.target.value)
                            }
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
