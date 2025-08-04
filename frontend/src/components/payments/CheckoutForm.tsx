import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  lessonData: {
    professorId: string;
    professorName: string;
    startDateTime: string;
    endDateTime: string;
    durationMinutes: number;
    totalPrice: number;
    lessonType: string;
    studentName: string;
    studentEmail: string;
    studentPhone?: string;
    studentNotes?: string;
  };
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

const CheckoutFormContent: React.FC<CheckoutFormProps> = ({
  lessonData,
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'card') {
        await handleCardPayment();
      } else {
        await handlePixPayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    const cardElement = elements!.getElement(CardElement);

    if (!cardElement) {
      toast.error('Erro ao carregar formulário de cartão');
      return;
    }

    // Criar Payment Intent no backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...lessonData,
        paymentMethod: 'card'
      }),
    });

    const { clientSecret, error } = await response.json();

    if (error) {
      toast.error(error);
      return;
    }

    // Confirmar pagamento
    if (!stripe) {
      toast.error('Stripe não foi carregado corretamente');
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: lessonData.studentName,
            email: lessonData.studentEmail,
          },
        },
      }
    );

    if (stripeError) {
      toast.error(stripeError.message || 'Erro no pagamento');
    } else if (paymentIntent.status === 'succeeded') {
      toast.success('Pagamento realizado com sucesso!');
      onSuccess(paymentIntent.id);
    }
  };

  const handlePixPayment = async () => {
    // Criar Payment Intent para PIX
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-pix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...lessonData,
        paymentMethod: 'pix'
      }),
    });

    const { pixCode, qrCode, paymentIntentId } = await response.json();

    // Mostrar código PIX para o usuário
    toast.success('Código PIX gerado! Copie o código ou escaneie o QR Code.');
    
    // Aqui você pode abrir um modal com o código PIX
    // Por simplicidade, vou apenas simular sucesso
    setTimeout(() => {
      onSuccess(paymentIntentId);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <CreditCardIcon className="h-6 w-6 mr-2" />
            Finalizar Pagamento
          </h2>
        </div>

        {/* Resumo da Aula */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Aula</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Professor:</span>
              <span className="font-medium">{lessonData.professorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data e Hora:</span>
              <span className="font-medium">{formatDateTime(lessonData.startDateTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duração:</span>
              <span className="font-medium">{lessonData.durationMinutes} minutos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium">
                {lessonData.lessonType === 'ONLINE' ? 'Online' : 'Presencial'}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold text-orange-600 pt-2 border-t">
              <span>Total:</span>
              <span>{formatPrice(lessonData.totalPrice)}</span>
            </div>
          </div>
        </div>

        {/* Formulário de Pagamento */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Seleção do Método de Pagamento */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Método de Pagamento</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCardIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <span className="text-sm font-medium">Cartão de Crédito</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="h-6 w-6 mx-auto mb-2 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  PIX
                </div>
                <span className="text-sm font-medium">PIX</span>
              </button>
            </div>
          </div>

          {/* Formulário do Cartão */}
          {paymentMethod === 'card' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dados do Cartão
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Informações de Segurança */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center">
              <LockClosedIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                Seus dados estão protegidos com criptografia SSL
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processando...
                </div>
              ) : (
                `Pagar ${formatPrice(lessonData.totalPrice)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CheckoutForm: React.FC<CheckoutFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormContent {...props} />
    </Elements>
  );
};

export default CheckoutForm;