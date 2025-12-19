<script lang="ts">
    import { onMount } from "svelte";
    import { api, type Item } from "../lib/api";

    let items: Item[] = [];
    let loading = true;
    let error = "";
    let successMessage = "";

    // Form state
    let formMode: "create" | "edit" = "create";
    let editingId: number | null = null;
    let name = "";
    let description = "";

    // Load all items
    async function loadItems() {
        try {
            loading = true;
            error = "";
            const response = await api.api.items.get();

            if (response.data) {
                items = response.data as Item[];
            } else if (response.error) {
                error = "Failed to load items";
            }
        } catch (e) {
            error = "Failed to connect to server";
            console.error(e);
        } finally {
            loading = false;
        }
    }

    // Create new item
    async function createItem() {
        try {
            error = "";
            successMessage = "";

            const response = await api.api.items.post({
                name,
                description,
            });

            if (response.data) {
                successMessage = "Item created successfully!";
                resetForm();
                await loadItems();
                setTimeout(() => (successMessage = ""), 3000);
            } else if (response.error) {
                error = "Failed to create item";
            }
        } catch (e) {
            error = "Failed to create item";
            console.error(e);
        }
    }

    // Update existing item
    async function updateItem() {
        if (editingId === null) return;

        try {
            error = "";
            successMessage = "";

            const response = await api.api
                .items({ id: editingId.toString() })
                .put({
                    name,
                    description,
                });

            if (response.data) {
                successMessage = "Item updated successfully!";
                resetForm();
                await loadItems();
                setTimeout(() => (successMessage = ""), 3000);
            } else if (response.error) {
                error = "Failed to update item";
            }
        } catch (e) {
            error = "Failed to update item";
            console.error(e);
        }
    }

    // Delete item
    async function deleteItem(id: number) {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            error = "";
            successMessage = "";

            const response = await api.api
                .items({ id: id.toString() })
                .delete();

            if (response.data) {
                successMessage = "Item deleted successfully!";
                await loadItems();
                setTimeout(() => (successMessage = ""), 3000);
            } else if (response.error) {
                error = "Failed to delete item";
            }
        } catch (e) {
            error = "Failed to delete item";
            console.error(e);
        }
    }

    // Start editing an item
    function startEdit(item: Item) {
        formMode = "edit";
        editingId = item.id;
        name = item.name;
        description = item.description;
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Reset form
    function resetForm() {
        formMode = "create";
        editingId = null;
        name = "";
        description = "";
    }

    // Handle form submission
    function handleSubmit(e: Event) {
        e.preventDefault();
        if (formMode === "create") {
            createItem();
        } else {
            updateItem();
        }
    }

    // Load items on mount
    onMount(() => {
        loadItems();
    });
</script>

<svelte:head>
    <title>CRUD</title>
</svelte:head>

<div class="container">
    {#if error}
        <div class="error">{error}</div>
    {/if}

    {#if successMessage}
        <div class="success">{successMessage}</div>
    {/if}

    <!-- Form -->
    <div class="card">
        <h2>{formMode === "create" ? "Create New Item" : "Edit Item"}</h2>
        <form on:submit={handleSubmit}>
            <div class="form-group">
                <label for="name">Name</label>
                <input
                    type="text"
                    id="name"
                    bind:value={name}
                    placeholder="Enter item name"
                    required
                />
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea
                    id="description"
                    bind:value={description}
                    placeholder="Enter item description"
                    required
                ></textarea>
            </div>

            <div style="display: flex; gap: 0.5rem;">
                <button type="submit" class="primary">
                    {formMode === "create" ? "Create Item" : "Update Item"}
                </button>
                {#if formMode === "edit"}
                    <button
                        type="button"
                        class="secondary"
                        on:click={resetForm}
                    >
                        Cancel
                    </button>
                {/if}
            </div>
        </form>
    </div>

    <!-- Items List -->
    <h2 style="margin-top: 2rem; margin-bottom: 1rem;">Items</h2>

    {#if loading}
        <div class="loading">Loading items...</div>
    {:else if items.length === 0}
        <div class="card" style="text-align: center; color: #888;">
            No items yet. Create your first item above!
        </div>
    {:else}
        <div class="item-list">
            {#each items as item (item.id)}
                <div class="item-card">
                    <div class="item-header">
                        <h3 class="item-title">{item.name}</h3>
                        <div class="item-actions">
                            <button
                                class="secondary"
                                on:click={() => startEdit(item)}
                            >
                                Edit
                            </button>
                            <button
                                class="danger"
                                on:click={() => deleteItem(item.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <p class="item-description">{item.description}</p>
                    <div class="item-meta">
                        ID: {item.id} | Created: {new Date(
                            item.createdAt,
                        ).toLocaleString()}
                        {#if item.updatedAt !== item.createdAt}
                            | Updated: {new Date(
                                item.updatedAt,
                            ).toLocaleString()}
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    form {
        margin-top: 1rem;
    }
</style>
