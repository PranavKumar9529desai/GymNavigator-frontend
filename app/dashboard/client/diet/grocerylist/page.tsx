import { fetchSavedGroceryLists } from "./_actions/fetch-saved-grocery-lists";
import { GrocerySelector } from "./_components/grocery-selector";

export default async function GroceryListPage() {
  const result = await fetchSavedGroceryLists();
  const groceryLists =
    !result.success || !result.groceryLists ? [] : result.groceryLists;

  return (
    <div className="container py-8">
      <GrocerySelector savedListsData={groceryLists} />
    </div>
  );
}
