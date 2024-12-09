import React from 'react';
import CustomInputSelect from '../CustomizeInputs/CustomInputSelect';

const ClientForm = ({ formData, handleClientChange, setFormData }) => {
    // Liste des entreprises qui ont déjà été saisies...
    const companies = [
        { name: "Nextmux SAS", email: "contact@nextmux.com", telephone: "+229 44 44 44 44", adresse: "Rue de la pharmacie de l'étoile" },
        { name: "Eig Bénin", email: "contact@eigb.com", telephone: "+229 44 44 44 44", adresse: "Carrefour Aïbatin" },
        { name: "SBEE, SONEB", email: "emaildelasoneb@support.com", telephone: "+229 44 44 44 44", adresse: "789 Boulevard C" },
    ];

    // Gestion du changement d'entreprise
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
                    // 'nom' reste à remplir manuellement
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                client: {
                    ...prev.client,
                    entreprise: selectedCompany,
                    email: "",
                    telephone: "",
                    adresse: "",
                    // 'nom' reste à remplir manuellement
                },
            }));
        }
    };

    return (
        <div className="space-y-4 mb-16">
            {/* Nom de l'entreprise ou particulier */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise ou particulier</label>
                <CustomInputSelect
                    value={formData.client.entreprise}
                    onChange={handleCompanyChange}
                    options={companies.map((c) => c.name)}
                    placeholder="Entrez un nom"
                />
            </div>

            {/* Nom du contact */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du contact</label>
                <input
                    type="text"
                    value={formData.client.nom}
                    onChange={(e) => handleClientChange("nom", e.target.value)}
                    maxLength={255}
                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                    placeholder="Nom du contact"
                    required
                />
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                    type="email"
                    value={formData.client.email}
                    onChange={(e) => handleClientChange("email", e.target.value)}
                    maxLength={63}
                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                    placeholder="email@exemple.com"
                    required
                />
            </div>

            {/* Téléphone */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                    type="tel"
                    value={formData.client.telephone}
                    onChange={(e) => handleClientChange("telephone", e.target.value.replace(/[^+\d\s]/g, ''))}  // Supprime les caractères non autorisés
                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                    placeholder="+229 XX XX XX XX"
                    maxLength={22}
                    required
                />
            </div>

            {/* Adresse */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                    type="text"
                    value={formData.client.adresse}
                    onChange={(e) => handleClientChange("adresse", e.target.value)}
                    maxLength={62}
                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-nextmux-green"
                    placeholder="123 rue Exemple"
                    required
                />
            </div>
        </div>
    );
};

export default ClientForm;
