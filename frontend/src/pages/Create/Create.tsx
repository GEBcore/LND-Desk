import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Pwd from '@/views/create/Pwd';
import Tab from '@/views/create/Tab';
import { useCreateStore } from '@/store/create';

function Create() {
  const {status} = useCreateStore()


  return (
    <div className='flex flex-col items-center justify-center mt-[48px] w-full' >
      {status === 'pwd' ? <Pwd/> :  <Tab/>}
    </div>
  )
}

export default Create
