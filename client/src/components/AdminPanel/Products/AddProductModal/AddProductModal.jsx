import styles from './AddProductModal.module.css';
import { useState, useRef, useEffect } from 'react';

const AddProductModal = ({
  initialData,
  teams,
  leagues,
  categories,
  sizes: availableSizes,
  onClose,
  onSave
}) => {

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [leagueId, setLeagueId] = useState('');
  const [teamId, setTeamId] = useState('');

  const [sizeStocks, setSizeStocks] = useState({});
  const [images, setImages] = useState([]);

  const [touched, setTouched] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef();
  const isEdit = initialData !== null;

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (!initialData) return;

    setProductName(initialData.name ?? '');
    setDescription(initialData.description ?? '');
    setPrice(initialData.price ?? '');
    setCategoryId(initialData.categoryId ?? '');
    setLeagueId(initialData.leagueId ?? '');
    setTeamId(initialData.teamId ?? '');

    const stocks = {};

    initialData.sizes?.forEach(s => {
      stocks[s.SizeId] = s.Stock;
    });

    setSizeStocks(stocks);

    const existingImages = initialData.images?.map(img => ({
      id: img.Id,
      url: img.ImageUrl,
      preview: img.ImageUrl,
      isMain: img.IsMain,
    })) ?? [];

    setImages(existingImages);

  }, [initialData]);

  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.preview?.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value);
    setLeagueId('');
    setTeamId('');
  };

  const handleLeagueChange = (e) => {
    setLeagueId(e.target.value);
    setTeamId('');
  };

  const filteredLeagues = leagues.filter(league => {
    if (!categoryId) return true;
    return league.categoryId === Number(categoryId);
  });

  const filteredTeams = teams.filter(team => {
    if (!leagueId) return true;
    return team.leagueId === Number(leagueId);
  });

  const handleStockChange = (sizeId, value) => {
    const num = Math.max(0, Number(value));

    setSizeStocks(prev => ({
      ...prev,
      [sizeId]: num,
    }));
  };

  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (images.length >= 3) return;

    const preview = URL.createObjectURL(file);
    const isFirstImage = images.length === 0;

    const newImage = {
      file: file,
      preview: preview,
      isMain: isFirstImage,
    };


    setImages(prev => [...prev, newImage]);

    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);

    // Ако сме изтрили главната снимка, правим първата от останалите за главна
    const removedWasMain = images[indexToRemove].isMain;
    if (removedWasMain && newImages.length > 0) {
      newImages[0] = { ...newImages[0], isMain: true };
    }

    setImages(newImages);
  };

  const handleSetMainImage = (indexToSetAsMain) => {
    const newImages = images.map((img, index) => ({
      ...img,
      isMain: index === indexToSetAsMain,
    }));
    setImages(newImages);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', 'my_preset');

    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dfkshzrs2/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();

    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    const formIsValid =
      productName.trim() !== '' &&
      price !== '' &&
      categoryId !== '' &&
      leagueId !== '' &&
      teamId !== '' &&
      images.length > 0;

    if (!formIsValid) return;

    setUploading(true);

    try {

      const uploadedImages = await Promise.all(
        images.map(async image => {
          if (image.file) {
            const url = await uploadToCloudinary(image.file);

            return {
              id: image.id,
              url,
              isMain: image.isMain,
            };
          }

          return {
            id: image.id,
            url: image.url,
            isMain: image.isMain,
          };
        })
      );

      const productSizes = [];

      for (const [sizeId, stock] of Object.entries(sizeStocks)) {
        if (stock > 0) {
          productSizes.push({
            id: Number(sizeId),
            stock: Number(stock),
          });
        }
      }

      onSave({
        productName: productName.trim(),
        description: description.trim(),
        price: parseFloat(price),
        categoryId: Number(categoryId),
        leagueId: Number(leagueId),
        teamId: Number(teamId),
        images: uploadedImages,
        productSizes,
      });

    } catch (error) {
      console.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>

        <h2 className={styles.modalTitle}>
          {isEdit ? 'Edit product' : 'Add product'}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>

          <div className={styles.grid}>

            <div className={styles.field}>
              <label className={styles.label}>Product name</label>
              <input
                className={styles.input}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product name"
                autoFocus
              />
              {touched && productName.trim() === '' && (
                <p className={styles.error}>Please enter a product name</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Price (€)</label>
              <input
                className={styles.input}
                type="number"
                min="0.00"
                step="1.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
              {touched && price === '' && (
                <p className={styles.error}>Please enter a price</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Category</label>
              <select className={styles.select} value={categoryId} onChange={handleCategoryChange}>
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {touched && categoryId === '' && (
                <p className={styles.error}>Please select a category</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>League</label>
              <select
                className={styles.select}
                value={leagueId}
                onChange={handleLeagueChange}
                disabled={categoryId === ''}
              >
                <option value="">Select league</option>
                {filteredLeagues.map(league => (
                  <option key={league.id} value={league.id}>{league.name}</option>
                ))}
              </select>
              {touched && leagueId === '' && (
                <p className={styles.error}>Please select a league</p>
              )}
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Team</label>
              <select
                className={styles.select}
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                disabled={leagueId === ''}
              >
                <option value="">Select team</option>
                {filteredTeams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              {touched && teamId === '' && (
                <p className={styles.error}>Please select a team</p>
              )}
            </div>

            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description..."
                rows={3}
              />
            </div>

          </div>

          <div className={styles.field}>
            <label className={styles.label}>Images</label>

            <div className={styles.imagesList}>
              {images.map((image, index) => (
                <div key={index} className={styles.imageItem}>
                  <img src={image.preview} alt={`Product ${index + 1}`} className={styles.imagePreview} />

                  {image.isMain && (
                    <span className={styles.mainBadge}>Main</span>
                  )}

                  <div className={styles.imageActions}>
                    {!image.isMain && (
                      <button
                        type="button"
                        className={styles.setMainBtn}
                        onClick={() => handleSetMainImage(index)}
                      >
                        Set as main
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.removeImageBtn}
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {images.length < 3 && (
                <button
                  type="button"
                  className={styles.addImageBtn}
                  onClick={() => fileInputRef.current.click()}
                >
                  + Add photo
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAddImage}
              style={{ display: 'none' }}
            />

            {touched && images.length === 0 && (
              <p className={styles.error}>Please add at least one image</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Sizes & stock</label>
            <div className={styles.sizesGrid}>
              {availableSizes.map(size => (
                <div key={size.id} className={styles.sizeItem}>
                  <span className={styles.sizeName}>{size.name}</span>
                  <input
                    type="number"
                    min="0"
                    className={styles.stockInput}
                    value={sizeStocks[size.id] ?? ''}
                    placeholder="0"
                    onChange={(e) => handleStockChange(size.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={uploading}>
              {uploading ? 'Uploading...' : isEdit ? 'Save changes' : 'Create'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
