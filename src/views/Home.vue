<template>
    <div v-if="showAddTask">
      <AddTask @add-task='addTask'/>
    </div>
    <Tasks @toggle-reminder="toggleReminder" 
    @delete-task="deleteTask"
     :tasks="tasks"/>
</template>

<script>
import Tasks from '../components/Tasks';
import AddTask from '../components/AddTask';

export default {
    name: 'Home',
    props: {
      showAddTask: Boolean,
    },
    components: {
        Tasks,
        AddTask,
    },
    data() {
      return {
        tasks: [],
      }
    },
    methods: {
    async addTask(task) {

      const body = {data : task}

      const res = await fetch('api/tasks',{
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          
        },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      const addData = {
        id: data.data.id,
      }
      Object.assign(addData, data.data.attributes);

      this.tasks = [ ...this.tasks, addData]
    },
    async deleteTask(id){
      if(confirm('Are you sure?')) {

        const res = await fetch(`api/tasks/${id}`,{
          method: 'DELETE',
        })

        res.status === 200 ? 
        (this.tasks = this.tasks.filter((task)=> task.id !==id)):
        alert('Error deleting task')

        
      }
      
    },
      async toggleReminder(id){
        const taskToggle = await this.fetchTask(id)
        const updTask = { ...taskToggle.data.attributes, reminder : !taskToggle.data.attributes.reminder}
        
        const body = {data : updTask}

        console.log(body)
        
        const res = await fetch(`api/tasks/${id}`,{
          method:'PUT',
          headers: {
            'Content-type':'application/json',
          },
          

          body: JSON.stringify(body)
        })

        const data = await res.json()

        this.tasks = this.tasks.map( (task)=> 
        task.id === id ? { ...task, reminder: data.data.attributes.reminder} : task
        )
      },
      async fetchTasks() {
        const res = await fetch('api/tasks')

        const data = await res.json()

        const newData = []

        for (let i = 0; i < data.data.length; i++) {
            
            newData.push({
              "id" : data.data[i].id,
              "text" : data.data[i].attributes.text,
              "day" : data.data[i].attributes.day,
              "reminder" : data.data[i].attributes.reminder,
            })
        }
        return newData
      },
      async fetchTask(id) {
        const res = await fetch(`api/tasks/${id}`)

        const data = await res.json()

        return data
      }
  },
  async created() {
    this.tasks =  await this.fetchTasks()
  }
}

</script>