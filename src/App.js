import { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createTask } from './graphql/mutations';
import { listTasks } from './graphql/queries';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import "./App.css"

//* Al usar withAuthenticator() tenemos la funcion signOut() que cierra la sesion de usuario y 
//* "user" que guarda la info del usuario
function App({signOut,user}) {
  const [task, setTask] = useState({
    name: "",
    description: ""
  });
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      //* Obteniendo todas las tareas de GraphQL 
      const result = await API.graphql(graphqlOperation(listTasks));
      setTasks(result.data.listTasks.items)
    }
    loadTasks();
  
    
  }, []);
  

  const handleSubmit = async(e) => {
    e.preventDefault();

    //* Creando una tarea con Mutation de GraphQL
    const result = await API.graphql(graphqlOperation(createTask, {input: task}));
    console.log(result);
  }

  return (
    <>
      {/* Muestra el codigo del usuario */}
      <Heading level={1}>Hello {user.username}</Heading>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={e => setTask({ ...task, name: e.target.value })}
          name="name"
          placeholder="name"
        />
        <textarea
          onChange={e => setTask({ ...task, description: e.target.value })}
          name="description"
          placeholder="description"
        ></textarea>

        <button>Submit</button>
      </form>
      <code>
        <pre>
          {JSON.stringify(tasks,null,2)}
        </pre>
      </code>
      
      {/* Muestra el boton para cerrar sesion */}
      <Button onClick={signOut}>Sign out</Button>
    </>
    
  );
}

//* Permite agregar unos parametros al componente App y mostrar login
export default withAuthenticator(App);
