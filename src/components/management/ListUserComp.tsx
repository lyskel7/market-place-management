'use client';
import { TUser } from '@/API';
import { getUsers } from '@/graphql/queries';
import { List } from '@mui/material';
import { generateClient } from 'aws-amplify/api';
import { useEffect, useState } from 'react';
import UserComp from './UserComp';

const client = generateClient();

const ListUserComp = () => {
  const [users, setUsers] = useState<TUser[] | null>(null); // Estado para guardar los usuarios
  const [error, setError] = useState<string | null>(null); // Estado para guardar errores
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado de carga

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError(null); // Limpia error anterior
      try {
        console.log('Fetching users...');
        // Await la llamada GraphQL
        const result = await client.graphql({
          query: getUsers,
          // Puedes añadir variables si tu query las necesita (ej: nextToken para paginación)
          // variables: { nextToken: null }
        });

        console.log('GraphQL Result:', result); // Log completo del resultado

        // ¡INSPECCIONA LOS ERRORES PRIMERO!
        if (result.errors) {
          console.error('GraphQL Errors:', result.errors);
          setError(`Error fetching users: ${result.errors[0].message}`); // Muestra el primer error
          setUsers(null);
        } else if (result.data?.getUsers) {
          // Si no hay errores y hay datos, actualiza el estado
          console.log('Users Data:', result.data.getUsers);
          setUsers(result.data.getUsers as TUser[]); // Guarda los usuarios en el estado
        } else {
          console.log('No users data found, but no errors.');
          setUsers([]); // Establece un array vacío si no hay datos
        }
      } catch (err) {
        // Captura errores de red o excepciones no manejadas
        console.error('Error calling GraphQL:', err);
        setError(`Failed to load users: ${err || 'Unknown error'}`);
        setUsers(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers(); // Llama a la función async
  }, []); // El array vacío asegura que se ejecute solo al montar

  // Renderiza basado en los estados
  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <List>
      {users?.map((user) => (
        <UserComp
          key={user.id}
          user={user}
        />
      ))}
    </List>
  );
};

export default ListUserComp;
