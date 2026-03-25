// app/enroll/page.js
import { Suspense } from 'react';
import EnrollmentForm from '../components/EnrollmentForm';


export default function EnrollPage() {
  return (
    <main>
      <h1>Enrollment Page</h1>
      
      
      <Suspense fallback={<div>Loading form...</div>}>
        <EnrollmentForm />
      </Suspense>
      
    </main>
  );
}