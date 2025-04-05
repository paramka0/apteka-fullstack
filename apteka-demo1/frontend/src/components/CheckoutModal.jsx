import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const baseSchema = {
  name: yup.string().required('Имя обязательно'),
  phone: yup.string()
    .required('Телефон обязателен')
    .matches(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Формат: +7 (XXX) XXX-XX-XX'),
  deliveryMethod: yup.string().required('Выберите способ получения'),
  paymentMethod: yup.string().required('Выберите способ оплаты')
};

const createSchema = (paymentMethod, deliveryMethod) => {
  const schema = { ...baseSchema };

  if (deliveryMethod === 'pickup') {
    schema.pharmacy = yup.string().required('Выберите аптеку');
  } else if (deliveryMethod === 'delivery') {
    schema.address = yup.string().required('Введите адрес');
  }

  if (paymentMethod === 'card') {
    schema.cardNumber = yup.string()
      .required('Введите номер карты')
      .matches(/^\d{16}$/, 'Номер карты должен содержать 16 цифр');
    schema.cardExpiry = yup.string()
      .required('Введите срок действия')
      .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Формат: MM/YY');
    schema.cardCvv = yup.string()
      .required('Введите CVV')
      .matches(/^\d{3}$/, 'CVV должен содержать 3 цифры');
  }

  return yup.object().shape(schema);
};

const CheckoutModal = ({ onClose, onSubmit, isProcessing }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(
      yup.lazy((data) => {
        return createSchema(data?.paymentMethod, data?.deliveryMethod);
      })
    )
  });

  const deliveryMethod = watch('deliveryMethod');

  const handleFormSubmit = (data) => {
    console.log('Order data:', data);
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Оформление заказа</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="mb-4">
            <h3 className="font-medium mb-2">Способ получения</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="pickup"
                  {...register('deliveryMethod')}
                  className="mr-2"
                />
                Самовывоз
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="delivery"
                  {...register('deliveryMethod')}
                  className="mr-2"
                />
                Доставка
              </label>
            </div>
            {errors.deliveryMethod && (
              <p className="text-red-500 text-sm mt-1">{errors.deliveryMethod.message}</p>
            )}
          </div>

          {deliveryMethod === 'pickup' && (
            <div className="mb-4">
              <label className="block mb-1">Аптека</label>
              <select
                {...register('pharmacy')}
                className="w-full p-2 border rounded"
              >
                <option value="">Выберите аптеку</option>
                <option value="pharmacy1">Аптека №1 (ул. Ленина, 10)</option>
                <option value="pharmacy2">Аптека №2 (ул. Гагарина, 5)</option>
              </select>
              {errors.pharmacy && (
                <p className="text-red-500 text-sm mt-1">{errors.pharmacy.message}</p>
              )}
            </div>
          )}

          {deliveryMethod === 'delivery' && (
            <div className="mb-4">
              <label className="block mb-1">Адрес доставки</label>
              <input
                type="text"
                {...register('address')}
                className="w-full p-2 border rounded"
                placeholder="Введите адрес"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-1">Имя</label>
            <input
              type="text"
              {...register('name')}
              className="w-full p-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1">Телефон</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full p-2 border rounded"
              placeholder="+7 (XXX) XXX-XX-XX"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Способ оплаты</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="cash"
                  {...register('paymentMethod')}
                  className="mr-2"
                />
                Наличными при получении
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="card"
                  {...register('paymentMethod')}
                  className="mr-2"
                />
                Картой онлайн
              </label>
              {watch('paymentMethod') === 'card' && (
                <div className="ml-6 mt-2 space-y-2">
                  <div>
                    <label className="block mb-1">Номер карты</label>
                    <input
                      type="text"
                      {...register('cardNumber')}
                      className="w-full p-2 border rounded"
                      placeholder="0000 0000 0000 0000"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Срок действия</label>
                      <input
                        type="text"
                        {...register('cardExpiry')}
                        className="w-full p-2 border rounded"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">CVV</label>
                      <input
                        type="text"
                        {...register('cardCvv')}
                        className="w-full p-2 border rounded"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ПОДТВЕРДИТЬ ЗАКАЗ
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
