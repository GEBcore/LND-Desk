import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Pwd from '@/pages/Create/Pwd';
import Tab from '@/pages/Create/Tab';
import { useCreateStore } from '@/store/create';

function Create() {
  const navigate = useNavigate();
  const { toast } = useToast()
  const {status} = useCreateStore()


  return (
    <div className='flex flex-col items-center justify-center h-screen mx-w-full'>
      <div style={{width:'fit-content', maxHeight:'500px', padding:'24px', border:'1px solid white', borderRadius:'8px', display:'flex', flexDirection:'column', alignItems: 'center', justifyItems:'center'}}>
        {status === 'pwd' ? <Pwd/> :  <Tab/>}
      </div>
    </div>
  )
}

export default Create
