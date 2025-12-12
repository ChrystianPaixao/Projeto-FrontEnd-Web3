import { useState, useEffect } from 'react';
import ProdutoCard from './ProdutoCard';
import { toast } from "react-toastify";
import { listarProdutos, filtros as filtrarProdutos } from '@/services/produtoService';
import { listarCategorias } from '@/services/categoriaService';

export default function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [categorias, setCategorias] = useState([]);

  const toastId = "carregando-produtos";

  useEffect(() => {
    async function carregarProdutos() {
      if (!toast.isActive(toastId)) {
        toast.loading("Carregando produtos...", { toastId });
      }
      try {
        const [responseCategorias, responseProdutos] = await Promise.all([
          listarCategorias(),
          listarProdutos()
        ]);

        setCategorias(responseCategorias.data);
        setProdutos(responseProdutos.data);

        toast.update(toastId, {
          render: "Produtos carregados!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
      } catch (err) {
        toast.update(toastId, {
          render: "Erro ao carregar produtos!",
          type: "error",
          isLoading: false,
          autoClose: 1000,
        });
      }
    }

    carregarProdutos();
  }, []);

  const handleFiltrarCategoria = async (categoriaId) => {
  setCategoriaSelecionada(categoriaId);

  try {
    toast.loading("Filtrando produtos", { toastId });

    const response = categoriaId
      ? await filtrarProdutos({ categoria: parseInt(categoriaId) })
      : await listarProdutos();

    setProdutos(response.data);

    const categoriaNome = categorias.find(c => c.id === parseInt(categoriaId))?.nome;
    toast.update(toastId, {
      render: categoriaId ? `Filtrado: ${categoriaNome}` : "Todos os produtos",
      type: "success",
      isLoading: false,
      autoClose: 1000,
    });
  } catch (err) {
    toast.update(toastId, {
      render: "Erro ao filtrar produtos!",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};


  const categoriaNomeSelecionada = categoriaSelecionada
    ? categorias.find(c => c.id === parseInt(categoriaSelecionada))?.nome
    : '';

  return (
  <div className="container mt-4">

    <div className="mb-4">
      <label className="form-label fw-bold">Filtrar por Categoria</label>

      <select
        className="form-select"
        style={{ maxWidth: "300px" }}
        value={categoriaSelecionada}
        onChange={(e) => handleFiltrarCategoria(e.target.value)}
      >
        <option value="">Todas as categorias</option>
        {categorias.map(categoria => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </option>
        ))}
      </select>
    </div>

    <ProdutoCard produtos={produtos} />

  </div>
);
}