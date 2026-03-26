// app/enroll/page.js
import { Suspense } from 'react';
import EnrollmentForm from '../components/EnrollmentForm';


export default function EnrollPage() {
  return (
    <main>
    
      
      
      <Suspense fallback={<div>Loading form...</div>}>
        <EnrollmentForm />
      </Suspense>
      
    </main>
  );
}