import { useRef } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import { Form } from './styles';
import { Modal } from '../Modal';
import { Input } from '../Input';

import { FoodType } from '../../types';

type EditFood = Omit<FoodType, 'available' | 'id'>;

type ModalEditFoodProps = {
  setIsOpen: () => void;
  handleUpdateFood: (data: EditFood) => void;
  editingFood: EditFood;
  isOpen: boolean;
};

export function ModalEditFood({
  isOpen,
  setIsOpen,
  editingFood,
  handleUpdateFood,
}: ModalEditFoodProps): JSX.Element {
  const formRef = useRef<FormHandles>(null);

  async function handleSubmit(data: EditFood): Promise<void> {
    handleUpdateFood(data);
    setIsOpen();
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={editingFood}>
        <h1>Editar Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />

        <button type="submit" data-testid="edit-food-button">
          <div className="text">Editar Prato</div>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};
