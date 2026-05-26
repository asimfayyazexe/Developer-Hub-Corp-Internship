import React, { useRef, useState } from 'react';
import {
  CheckCircle2,
  Download,
  FileSignature,
  FileText,
  PenLine,
  Share2,
  Trash2,
  Upload,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { chamberDocuments } from '../../data/collaborationHub';
import { ChamberDocument } from '../../types';

const statusVariant = {
  Draft: 'gray',
  'In Review': 'warning',
  Signed: 'success',
} as const;

export const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<ChamberDocument[]>(chamberDocuments);
  const [selectedDocumentId, setSelectedDocumentId] = useState(chamberDocuments[0]?.id ?? '');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!user) return null;

  const selectedDocument =
    documents.find((document) => document.id === selectedDocumentId) ?? documents[0];

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploadedDocument: ChamberDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.type.includes('pdf') ? 'PDF' : 'Document',
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      lastModified: new Date(file.lastModified).toISOString().slice(0, 10),
      shared: false,
      url: URL.createObjectURL(file),
      ownerId: user.id,
      dealName: 'New deal chamber',
      status: 'Draft',
    };

    setDocuments((currentDocuments) => [uploadedDocument, ...currentDocuments]);
    setSelectedDocumentId(uploadedDocument.id);
    setHasSignature(false);
    event.target.value = '';
  };

  const updateDocumentStatus = (status: ChamberDocument['status']) => {
    if (!selectedDocument) return;

    setDocuments((currentDocuments) =>
      currentDocuments.map((document) =>
        document.id === selectedDocument.id
          ? {
              ...document,
              status,
              signer: status === 'Signed' ? user.name : document.signer,
            }
          : document
      )
    );
  };

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const startSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(event);
    const context = canvasRef.current?.getContext('2d');
    if (!point || !context) return;

    context.beginPath();
    context.moveTo(point.x, point.y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const drawSignature = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const point = getCanvasPoint(event);
    const context = canvasRef.current?.getContext('2d');
    if (!point || !context) return;

    context.lineWidth = 2;
    context.lineCap = 'round';
    context.strokeStyle = '#1D4ED8';
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const signDocument = () => {
    if (!hasSignature) return;
    updateDocumentStatus('Signed');
  };

  const storageUsed = documents.reduce((total, document) => {
    const numericSize = Number.parseFloat(document.size);
    return total + (Number.isNaN(numericSize) ? 0 : numericSize);
  }, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleUpload}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600">Manage deal files, previews, and signatures</p>
        </div>
        <Button leftIcon={<Upload size={18} />} onClick={() => fileInputRef.current?.click()}>
          Upload document
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="space-y-6 xl:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Storage</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Used</span>
                  <span className="font-medium text-gray-900">{storageUsed.toFixed(1)} MB</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-primary-600"
                    style={{ width: `${Math.min(storageUsed * 3, 90)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Documents</span>
                  <span className="font-medium text-gray-900">{documents.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 border-t border-gray-200 pt-4 text-center">
                {(['Draft', 'In Review', 'Signed'] as ChamberDocument['status'][]).map((status) => (
                  <div key={status} className="rounded-md bg-gray-50 p-2">
                    <p className="text-lg font-semibold text-gray-900">
                      {documents.filter((document) => document.status === status).length}
                    </p>
                    <p className="text-xs text-gray-500">{status}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Files</h2>
            </CardHeader>
            <CardBody className="space-y-2">
              {documents.map((document) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => {
                    setSelectedDocumentId(document.id);
                    setHasSignature(false);
                    clearSignature();
                  }}
                  className={`w-full rounded-md border p-3 text-left transition-colors ${
                    selectedDocument?.id === document.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-md bg-white p-2 text-primary-600 shadow-sm">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{document.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {document.dealName} - {document.size}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant={statusVariant[document.status]} size="sm">
                          {document.status}
                        </Badge>
                        {document.shared && (
                          <Badge variant="secondary" size="sm">
                            Shared
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6 xl:col-span-3">
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {selectedDocument?.name ?? 'No document selected'}
                </h2>
                {selectedDocument && (
                  <p className="text-sm text-gray-500">
                    {selectedDocument.dealName} - Modified {selectedDocument.lastModified}
                  </p>
                )}
              </div>
              {selectedDocument && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<FileSignature size={16} />}
                    onClick={() => updateDocumentStatus('In Review')}
                  >
                    Send to review
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2" aria-label="Download">
                    <Download size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-2" aria-label="Share">
                    <Share2 size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-2 text-error-600 hover:text-error-700"
                    aria-label="Delete"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardBody>
              {selectedDocument ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <div className="flex min-h-96 items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                      {selectedDocument.type === 'PDF' && selectedDocument.url ? (
                        <iframe
                          src={selectedDocument.url}
                          title={selectedDocument.name}
                          className="h-96 w-full"
                        />
                      ) : (
                        <div className="p-8 text-center">
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-primary-100 text-primary-700">
                            <FileText size={32} />
                          </div>
                          <p className="font-semibold text-gray-900">{selectedDocument.name}</p>
                          <p className="mt-2 text-sm text-gray-500">
                            {selectedDocument.type} preview - {selectedDocument.size}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-md border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">Status</p>
                        <Badge variant={statusVariant[selectedDocument.status]}>
                          {selectedDocument.status}
                        </Badge>
                      </div>
                      <div className="mt-4 space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Owner</span>
                          <span className="font-medium text-gray-900">
                            {selectedDocument.ownerId === user.id ? 'You' : selectedDocument.ownerId}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Signer</span>
                          <span className="font-medium text-gray-900">
                            {selectedDocument.signer ?? 'Awaiting signature'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shared</span>
                          <span className="font-medium text-gray-900">
                            {selectedDocument.shared ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md border border-gray-200 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">E-signature</p>
                        <PenLine size={18} className="text-primary-600" />
                      </div>
                      <canvas
                        ref={canvasRef}
                        width={420}
                        height={160}
                        onPointerDown={startSignature}
                        onPointerMove={drawSignature}
                        onPointerUp={() => setIsDrawing(false)}
                        onPointerLeave={() => setIsDrawing(false)}
                        className="h-40 w-full touch-none rounded-md border border-dashed border-gray-300 bg-white"
                      />
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          leftIcon={<CheckCircle2 size={16} />}
                          disabled={!hasSignature}
                          onClick={signDocument}
                        >
                          Sign
                        </Button>
                        <Button size="sm" variant="outline" onClick={clearSignature}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">No document selected.</div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
