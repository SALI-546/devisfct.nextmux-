import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Download, Share, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

const FactView = () => {
    const getInvoiceIdFromURL = () => {
        const pathParts = window.location.pathname.split('/');
        return pathParts[pathParts.length - 1];
    };

    const id = getInvoiceIdFromURL();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axios.get(`/api/invoices/${id}`);
                setInvoice(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de la facture:', error);
                toast.error('Erreur lors de la récupération de la facture.');
            } finally {
                setLoading(false);
            }
        };
        fetchInvoice();
    }, [id]);

    const calculateTotals = () => {
        if (!invoice) return { totalHT: 0, totalTVA: 0, totalTTC: 0 };

        const totalHT = invoice.items.reduce((sum, item) =>
            sum + (Number(item.quantite) * Number(item.prix)), 0);

        let totalTVA = 0;
        if (invoice.include_tva) {
            totalTVA = invoice.items.reduce((sum, item) =>
                sum + (Number(item.quantite) * Number(item.prix) * (Number(item.tva) / 100)), 0);
        }

        return {
            totalHT,
            totalTVA,
            totalTTC: totalHT + totalTVA
        };
    };

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        const previewElement = document.getElementById('facture-preview');

        if (!previewElement) {
            toast.error('Élément de prévisualisation non trouvé');
            setIsDownloading(false);
            return;
        }

        try {
            const canvas = await html2canvas(previewElement, {
                scale: 3,
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: null
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'l' : 'p',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height, '', 'FAST');
            pdf.save(`facture_${invoice.numero}.pdf`);
            toast.success('PDF téléchargé avec succès !');
        } catch (error) {
            console.error('Erreur lors de la génération du PDF :', error);
            toast.error('Impossible de générer le PDF');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = () => {
        if (!invoice) return;
        const shareData = {
            title: `Facture ${invoice.numero}`,
            text: `Voici la facture #${invoice.numero}.`,
            url: window.location.href,
        };
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => toast.success('Facture partagée avec succès !'))
                .catch((err) => console.error('Erreur lors du partage:', err));
        } else {
            navigator.clipboard.writeText(shareData.url)
                .then(() => toast.success('Lien copié dans le presse-papiers !'))
                .catch((err) => console.error('Erreur lors de la copie du lien:', err));
        }
    };

    const handleBack = () => {
        window.location.href = '/factures';
    };

    if (loading) {
        return <p className="text-center text-gray-500">Chargement de la facture...</p>;
    }

    if (!invoice) {
        return <p className="text-center text-gray-500">Facture non trouvée.</p>;
    }

    const totals = calculateTotals();

    return (
        <div className="container mx-auto px-4 py-8">
            <ToastContainer />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Facture #{invoice.numero}</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className={`p-2 bg-nextmux-green text-white rounded-md hover:bg-black flex items-center justify-center ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Télécharger en PDF"
                    >
                        {isDownloading ? 'Téléchargement...' : <Download size={20} />}
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center"
                        title="Partager la facture"
                    >
                        <Share size={20} />
                    </button>
                    <button
                        onClick={handleBack}
                        className="p-2 bg-gray-300 text-black rounded-md hover:bg-gray-500 flex items-center justify-center"
                        title="Retour à la liste des factures"
                    >
                        <Eye size={20} />
                    </button>
                </div>
            </div>

            <div id="facture-preview" className="bg-white p-8 border rounded-lg shadow">
                <div className="flex justify-between items-start mb-8">
                    {invoice.logo_url && (
                        <div className="w-48">
                            <img src={invoice.logo_url} alt="Logo entreprise" className="max-w-28 h-28 object-contain" />
                        </div>
                    )}
                    <div className="text-right flex-1">
                        <h1 className="text-2xl font-bold text-gray-800">FACTURE</h1>
                        <p className="text-gray-600">N° {invoice.numero}</p>
                        <p className="text-gray-600">Date : {new Date(invoice.date_emission).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="border p-4 rounded-lg shadow-sm">
                        <h2 className="font-semibold mb-4 border-b pb-2 text-dtr-brown">ÉMETTEUR</h2>
                        <div className="pt-2">
                            <p className="font-bold text-dtr-dark">{invoice.emetteur?.nom || "Nom de l'émetteur ou de l'entreprise"}</p>
                            <p className="text-dtr-dark">{invoice.emetteur.adresse}</p>
                            <p className="text-dtr-dark">{invoice.emetteur.email}</p>
                            <p className="text-dtr-dark">{invoice.emetteur.telephone}</p>
                        </div>
                    </div>
                    <div className="border p-4 rounded-lg shadow-sm">
                        <h2 className="font-semibold mb-2 border-b pb-2">CLIENT</h2>
                        <div className="pt-2">
                            <p className="font-bold">{invoice.client?.entreprise || 'Entreprise non renseignée'}</p>
                            <p>{invoice.client?.nom}</p>
                            <p>{invoice.client?.adresse}</p>
                            <p>{invoice.client?.email}</p>
                            <p>{invoice.client?.telephone}</p>
                        </div>
                    </div>
                </div>
                <table className="w-full mb-8">
                    <thead className="bg-gray-50">
                        <tr className="border-b">
                            <th className="text-left p-2">Produit</th>
                            <th className="text-right p-2">Qté</th>
                            <th className="text-right p-2">Prix unitaire</th>
                            {invoice.include_tva && <th className="text-right p-2">TVA</th>}
                            <th className="text-right p-2">Total HT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">
                                    {item.product ? (
                                        <>
                                            <div className="font-semibold">{item.product.name}</div>
                                            {item.product.description && (
                                                <div className="text-sm text-gray-500">{item.product.description}</div>
                                            )}
                                        </>
                                    ) : (
                                        item.description
                                    )}
                                </td>
                                <td className="text-right p-2">{item.quantite}</td>
                                <td className="text-right p-2">{Number(item.prix).toFixed(2)} XOF</td>
                                {invoice.include_tva && <td className="text-right p-2">{item.tva || 0}%</td>}
                                <td className="text-right p-2">
                                    {(Number(item.quantite) * Number(item.prix)).toFixed(2)} XOF
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end mb-8">
                    <div className="w-64">
                        <div className="flex justify-between border-b py-2">
                            <span>Total HT</span>
                            <span>{totals.totalHT.toFixed(2)} XOF</span>
                        </div>
                        {invoice.include_tva && (
                            <div className="flex justify-between border-b py-2">
                                <span>TVA</span>
                                <span>{totals.totalTVA.toFixed(2)} XOF</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold py-2">
                            <span>Total TTC</span>
                            <span>{totals.totalTTC.toFixed(2)} XOF</span>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Conditions de paiement</h3>
                    <p>Mode de paiement : {invoice.paiement}</p>
                    {invoice.commentaires && (
                        <p className="mt-2">{invoice.commentaires}</p>
                    )}
                </div>
                <div className="pt-4 flex justify-end">
                    <div className="text-right">
                        <h3 className="font-semibold mb-2">Signature</h3>
                        {invoice.signature_url && (
                            <img
                                src={invoice.signature_url} // Utilisation de 'signature_url' directement
                                alt="Signature numérique"
                                className="mt-2 max-h-24 object-contain border border-gray-300 rounded-md"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FactView;
