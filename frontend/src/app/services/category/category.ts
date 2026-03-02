import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

const categories = gql`
  query {
    categories {
      name
      description
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(createCategoryInput: $input) {
      id
      name
      description
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $input) {
      id
      name
      description
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation RemoveCategory($id: String!) {
    removeCategory(id: $id) {
      id
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private apollo: Apollo) {}

  getCategories() {
    return this.apollo
      .query<{ categories: { name: string; description: string }[] }>({
        query: categories,
      })
      .pipe(map((result) => result.data!.categories));
  }

  createCategory(name: string, description: string) {
    return this.apollo.mutate({
      mutation: CREATE_CATEGORY,
      variables: { input: { name, description } },
    });
  }

  updateCategory(id: string, name: string, description: string) {
    return this.apollo.mutate({
      mutation: UPDATE_CATEGORY,
      variables: { input: { id, name, description } },
    });
  }

  deleteCategory(id: string) {
    return this.apollo.mutate({
      mutation: DELETE_CATEGORY,
      variables: { id },
    });
  }
}
/*
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

const GET_CATEGORIES = gql`
  query {
    categories {
      id
      name
      description
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(createCategoryInput: $input) {
      id
      name
      description
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $input) {
      id
      name
      description
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation RemoveCategory($id: String!) {
    removeCategory(id: $id) {
      id
    }
  }
`;

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private apollo: Apollo) {}

  getCategories() {
    return this.apollo
      .query<{ categories: { id: string; name: string; description: string }[] }>({
        query: GET_CATEGORIES,
      })
      .pipe(map((result) => result.data!.categories));
  }

  createCategory(name: string, description: string) {
    return this.apollo.mutate({
      mutation: CREATE_CATEGORY,
      variables: { input: { name, description } },
    });
  }

  updateCategory(id: string, name: string, description: string) {
    return this.apollo.mutate({
      mutation: UPDATE_CATEGORY,
      variables: { input: { id, name, description } },
    });
  }

  deleteCategory(id: string) {
    return this.apollo.mutate({
      mutation: DELETE_CATEGORY,
      variables: { id },
    });
  }
}
 */
