/**
 * Example component showing Redux integration
 * This demonstrates:
 * - Using typed hooks
 * - Accessing state
 * - Dispatching actions
 * - Handling loading states
 * - Displaying errors
 */

interface ExampleProps {
  title?: string;
}

export function ReduxExample({ title = 'Redux Example' }: ExampleProps) {
  // Import from '@/redux/hooks' for typed hooks
  // Import from '@/redux/[feature]/[feature]Actions' for actions

  // Example structure:
  // const dispatch = useAppDispatch();
  // const data = useAppSelector(selectYourState);
  // const loading = useAppSelector(selectYourLoading);
  // const error = useAppSelector(selectYourError);

  // const handleAction = () => {
  //   dispatch(yourActions.someAction(payload));
  // };

  // return (
  //   <div>
  //     {loading && <div>Loading...</div>}
  //     {error && <div>Error: {error}</div>}
  //     {data && <div>Data: {JSON.stringify(data)}</div>}
  //     <button onClick={handleAction}>Perform Action</button>
  //   </div>
  // );

  return (
    <div className="p-4 border rounded bg-blue-50">
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-700">
        This is a template component showing how to structure Redux integration.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Replace this component with your actual implementation.
      </p>
    </div>
  );
}
