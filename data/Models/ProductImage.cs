using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RezervistUmbraco.Data.Models
{
    public class ProductImage
    {
        public string Id { get; set; }

        public bool IsMain { get; set; }

        public byte[] Data { get; set; }

        public string ProductId { get; set; }

        public int ProductImmagesStorageId { get; set; }

        public ProductImmagesStorage ProductImmagesStorage { get; set; }

        public ProductImage()
        {
            this.Id = Guid.NewGuid().ToString();
        }

        public ProductImage(byte[] data, bool isMain) : this()
        {
            this.Data = data;
            this.IsMain = isMain;
        }
    }
}