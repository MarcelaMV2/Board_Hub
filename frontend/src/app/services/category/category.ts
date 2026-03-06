import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Category } from '../../models/category.model';

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

  getCategories(): Observable<Category[]> {
    return this.apollo
      .query<{ categories: Category[] }>({
        query: GET_CATEGORIES,
      })
      .pipe(map((result) => result.data!.categories));
  }

  createCategory(name: string, description: string): Observable<Category> {
    return this.apollo
      .mutate<{ createCategory: Category }>({
        mutation: CREATE_CATEGORY,
        variables: { input: { name, description } },
      })
      .pipe(map((res) => res.data!.createCategory));
  }

  updateCategory(
    id: string,
    name: string,
    description: string
  ): Observable<Category> {
    return this.apollo
      .mutate<{ updateCategory: Category }>({
        mutation: UPDATE_CATEGORY,
        variables: { input: { id, name, description } },
      })
      .pipe(map((res) => res.data!.updateCategory));
  }

  deleteCategory(id: string): Observable<string> {
    return this.apollo
      .mutate<{ removeCategory: { id: string } }>({
        mutation: DELETE_CATEGORY,
        variables: { id },
      })
      .pipe(map((res) => res.data!.removeCategory.id));
  }
}
