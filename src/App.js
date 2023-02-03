import {useState} from 'react';
import './App.css';

function Header(props){
  return <header>
    <h1><a href="/" onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title} </a></h1>
  </header>
}

function Article(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}

function Nav(props){
  
  const lis = [
  ]

  for(const element of props.topics){
    let t = element;
    lis.push(<li key={t.id}>
      <a id={t.id} href={"/read/" + t.id} onClick={event=>{
      event.preventDefault();
      props.onChangeMode(event.target.id); //타겟은 a태그

    }}>{t.title}</a></li>)
  }

  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p>
        <textarea name="body" placeholder="body"></textarea>
      </p>
      <p><input type="submit" value="Create"/></p>
    </form>
  </article>
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
  <h2>Update</h2>
  <form onSubmit={event=>{
    event.preventDefault();
    const _title = event.target.title.value;
    const _body = event.target.body.value;
    console.log(_title)
    props.onUpdate(_title, _body);
  }}>
    <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
      setTitle(event.target.value);
      }}/></p>
    <p>
      <textarea name="body" placeholder="body" value={body} onChange={event =>{
        setBody(event.target.value);
      }}></textarea>
    </p>
    <p><input type="submit" value="Update"/></p>
  </form>
</article>
}

function App() {

  const [mode, setMode] = useState("Welcome");
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4)
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ....'},
    {id:2, title:'css', body:'css is ....'},
    {id:3, title:'javascript', body:'javascript is ....'}
  ]);
  let content = null;
  let contextControl = null;



  if(mode ==="Welcome"){
    content = <Article title = "Welcome" body="Hello Web"></Article>
  }else if(mode === "Read"){
    let title, body = null;
    for(let i = 0; i<topics.length; i++){
      if(topics[i].id === Number(id)){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title = {title} body={body}></Article>
    contextControl =<div>
      <li><a href={"/update" + id} onClick={event =>{
        event.preventDefault();
        setMode('Update');
      }}>Update</a></li>
      <li><a href={"/delete" + id} onClick={event=>{
        event.preventDefault();
        setMode('Delete');
      }}>Delete</a></li>
    </div>
  }else if(mode === "Create"){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      setId(nextId);
      setMode('Read');
      console.log(mode);

      setNextId(nextId+1);
    }}></Create>
  }else if(mode === "Update"){
    let title, body = null;
    for(let i = 0; i<topics.length; i++){
      if(topics[i].id === Number(id)){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body ={body} onUpdate={(title, body)=>{
      console.log(title, id);
      const updatedTopic = {id:id, title:title, body:body}
      const newTopics = [...topics]
      for(let i = 0;i < newTopics.length; i++){
        console.log(newTopics[i].id)
        if(newTopics[i].id === Number(id)){
          newTopics[i] = updatedTopic;
          console.log(newTopics[i])
          console.log(id)
          break;
        }
      }
      console.log(newTopics);
      setTopics(newTopics);
    }}></Update>
  }else if(mode === "Delete"){
    const newTopics = [...topics]
    for(let i = 0;i < newTopics.length; i++){
      if(newTopics[i].id === Number(id)){
        newTopics.splice(i,1);
        break;
      }
    }
    setTopics(newTopics);
    setMode("Welcome");
  }



  return (
    <div className="App">
      <Header title="REACT" onChangeMode={()=>{
        setMode("Welcome");
    }}></Header>

      <Nav topics= {topics} onChangeMode={(_id)=>{
        setMode('Read');
        setId(_id);
      }}>
      </Nav>

      {content}
      <ul>
        <li>
          <a href ="/create" onClick={event=>{
            event.preventDefault();
            setMode("Create");
          }}>Create </a>
        </li>
          {contextControl}

      </ul>

    </div>
  );
}

export default App;
